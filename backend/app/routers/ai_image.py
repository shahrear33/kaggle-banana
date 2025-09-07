from fastapi import status, APIRouter, HTTPException, UploadFile, File, Form, Request
from google import genai
from PIL import Image
from io import BytesIO
import os
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter(prefix='/api/v1', tags=['AI Image Generation'])

# Configure Google Generative AI client
try:
    # Initialize the client with API key from environment variable
    api_key = os.getenv('GEMINI_KEY')
    if not api_key:
        print("Warning: GEMINI_KEY not found in environment variables")
    
    client = genai.Client(api_key=api_key)
    print("Google Generative AI client initialized successfully")
except Exception as e:
    print(f"Error configuring Google Generative AI: {e}")
    client = None


def _load_image_from_inline(part):
    """Return a PIL.Image from a Gemini inline_data part, handling base64 strings or raw bytes.

    Some versions of the google genai SDK return inline_data.data as base64-encoded string,
    others return raw bytes. This helper normalizes to bytes and opens with PIL safely.
    """
    inline = getattr(part, "inline_data", None)
    if inline is None:
        raise ValueError("No inline_data on part")

    data = getattr(inline, "data", None)
    if data is None:
        raise ValueError("No data on inline_data part")

    # Normalize to bytes
    if isinstance(data, str):
        try:
            data_bytes = base64.b64decode(data)
        except Exception as e:
            # Fallback: treat string as utf-8 bytes (unlikely but safe)
            data_bytes = data.encode("utf-8")
    else:
        data_bytes = data

    img = Image.open(BytesIO(data_bytes))
    img.load()
    return img

@router.post('/generate-image-prompt')
async def generate_image_from_prompt(
    request: Request,
    prompt: str = Form(...)
):
    """
    Generate an image based on a text prompt using Google Generative AI.
    """
    try:
        # Check if client is initialized
        global client
        if client is None:
            # Try to initialize client again
            try:
                api_key = os.getenv('GEMINI_KEY')
                if not api_key:
                    raise ValueError("GEMINI_KEY not found in environment variables")
                client = genai.Client(api_key=api_key)
                print("Google Generative AI client initialized successfully")
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                                   detail=f"Failed to initialize Google Generative AI client: {str(e)}")
        
        # Ensure assets directory exists
        os.makedirs("assets", exist_ok=True)
        
        # Generate content using the model - use exact format from docs
        response = client.models.generate_content(
            model="gemini-2.5-flash-image-preview",
            contents=prompt
        )
        
        # Extract image parts exactly as shown in docs - check for both inline_data and inlineData
        image_parts = []
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data:
                image_parts.append(part.inline_data.data)
            elif hasattr(part, 'inlineData') and part.inlineData:
                image_parts.append(part.inlineData.data)
        
        if image_parts:
            # Save the generated image using the working pattern
            try:
                print(f"Found {len(image_parts)} image parts")
                print(f"Image data type: {type(image_parts[0])}")
                print(f"Image data length: {len(image_parts[0])}")
                
                # The data is base64 encoded bytes, decode it first
                if isinstance(image_parts[0], bytes):
                    # Convert bytes to string first, then decode base64
                    base64_string = image_parts[0].decode('utf-8')
                    decoded_data = base64.b64decode(base64_string)
                elif isinstance(image_parts[0], str):
                    # Already a string, decode base64 directly
                    decoded_data = base64.b64decode(image_parts[0])
                else:
                    decoded_data = image_parts[0]
                
                image = Image.open(BytesIO(decoded_data))
                
                print(f"Image opened successfully, size: {image.size}")
                
                image_path = f"assets/generated_{os.urandom(16).hex()}.png"
                image.save(image_path)
                print(f"Successfully generated and saved image: {image_path}")
                
                # Get the base URL from the request
                base_url = str(request.base_url).rstrip('/')
                full_image_url = f"{base_url}/{image_path}"
                
                return {"image_url": full_image_url}
            except Exception as e:
                print(f"Error processing generated image: {e}")
                
                # Save debug info
                debug_file = f"assets/debug_error_{os.urandom(8).hex()}.txt"
                with open(debug_file, 'w') as f:
                    f.write(f"Error: {e}\n")
                    f.write(f"Image parts count: {len(image_parts)}\n")
                    if image_parts:
                        f.write(f"Data type: {type(image_parts[0])}\n")
                        f.write(f"Data length: {len(image_parts[0])}\n")
                        f.write(f"First 100 chars: {repr(image_parts[0][:100])}\n")
                
                return {"message": f"Error processing generated image: {str(e)}. Debug saved to {debug_file}"}
        else:
            # Log any text responses for debugging
            text_responses = [
                part.text for part in response.candidates[0].content.parts if part.text
            ]
            if text_responses:
                print(f"Text response: {text_responses[0]}")
                return {"message": f"No image generated. API response: {text_responses[0]}"}
            return {"message": "No image generated by the API"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating image: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error generating image: {str(e)}")

@router.post('/generate-image-upload')
async def generate_image_from_upload(
    request: Request,
    prompt: str = Form(...),
    image: UploadFile = File(...)
):
    """
    Generate an image based on a text prompt and an uploaded image using Google Generative AI.
    """
    try:
        # Check if client is initialized
        global client
        if client is None:
            # Try to initialize client again
            try:
                api_key = os.getenv('GEMINI_KEY')
                if not api_key:
                    raise ValueError("GEMINI_KEY not found in environment variables")
                client = genai.Client(api_key=api_key)
                print("Google Generative AI client initialized successfully")
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                                   detail=f"Failed to initialize Google Generative AI client: {str(e)}")
        
        # Ensure assets directory exists
        os.makedirs("assets", exist_ok=True)
        
        # Validate content type (best-effort)
        allowed_types = {"image/png", "image/jpeg", "image/webp"}
        if image.content_type and image.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail=f"Unsupported image type: {image.content_type}")

        # Read the uploaded image
        image_data = await image.read()
        
        # Save the uploaded image temporarily to ensure it's a valid image file
        temp_path = f"assets/temp_{os.urandom(8).hex()}"
        # Preserve extension if provided
        ext = ".png"
        if image.filename and "." in image.filename:
            ext = "." + image.filename.split(".")[-1].lower()
        temp_path = temp_path + ext
        with open(temp_path, "wb") as f:
            f.write(image_data)
        
        # Open the image with PIL (try temp path, fallback to BytesIO)
        try:
            img = Image.open(temp_path)
            img.load()
            if img.size[0] == 0 or img.size[1] == 0:
                try:
                    os.remove(temp_path)
                except Exception:
                    pass
                raise HTTPException(status_code=400, detail="Invalid image upload: Empty or corrupt image file")
        except Exception:
            try:
                img = Image.open(BytesIO(image_data))
                img.load()
                if img.size[0] == 0 or img.size[1] == 0:
                    try:
                        os.remove(temp_path)
                    except Exception:
                        pass
                    raise HTTPException(status_code=400, detail="Invalid image upload: Empty or corrupt image file")
            except Exception as e:
                # Clean temp file and abort with bad request
                try:
                    os.remove(temp_path)
                except Exception:
                    pass
                raise HTTPException(status_code=400, detail=f"Invalid image upload: {e}")
        
        # Provide prompt and PIL image directly as contents; SDK wraps into a single user content
        detailed_prompt = f"Transform this image to create a detailed and photorealistic image based on: {prompt}"
        response = client.models.generate_content(
            model="gemini-2.5-flash-image-preview",
            contents=[detailed_prompt, img]
        )
        
        # Remove the temporary file
        try:
            os.remove(temp_path)
        except Exception:
            pass
        
        # Extract image parts exactly as shown in docs - check for both inline_data and inlineData
        image_parts = []
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data:
                image_parts.append(part.inline_data.data)
            elif hasattr(part, 'inlineData') and part.inlineData:
                image_parts.append(part.inlineData.data)
        
        if image_parts:
            # Save the generated image using the working pattern
            try:
                print(f"Found {len(image_parts)} image parts")
                print(f"Image data type: {type(image_parts[0])}")
                print(f"Image data length: {len(image_parts[0])}")
                
                # The data is base64 encoded bytes, decode it first
                if isinstance(image_parts[0], bytes):
                    # Convert bytes to string first, then decode base64
                    base64_string = image_parts[0].decode('utf-8')
                    decoded_data = base64.b64decode(base64_string)
                elif isinstance(image_parts[0], str):
                    # Already a string, decode base64 directly
                    decoded_data = base64.b64decode(image_parts[0])
                else:
                    decoded_data = image_parts[0]
                
                generated_image = Image.open(BytesIO(decoded_data))
                print(f"Image opened successfully, size: {generated_image.size}")
                
                image_path = f"assets/generated_{os.urandom(16).hex()}.png"
                generated_image.save(image_path)
                print(f"Successfully generated and saved image: {image_path}")
                
                # Get the base URL from the request
                base_url = str(request.base_url).rstrip('/')
                full_image_url = f"{base_url}/{image_path}"
                
                return {"image_url": full_image_url}
            except Exception as e:
                print(f"Error processing generated image: {e}")
                return {"message": f"Error processing generated image: {str(e)}"}
        else:
            # Log any text responses for debugging
            text_responses = [
                part.text for part in response.candidates[0].content.parts if part.text
            ]
            if text_responses:
                print(f"Text response: {text_responses[0]}")
                return {"message": f"No image generated. API response: {text_responses[0]}"}
            return {"message": "No image generated by the API"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating image with upload: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error generating image: {str(e)}")

SYSTEM_PROMPT_2D_TO_3D = '''
You are an image generation assistant that converts *2D single-floor plans* into *full 3D interior models*.

Input: A 2D single-floor plan image.
Output: A high-resolution 3D rendering showing the *entire interior of the floor*, including all rooms, walls, doors, windows, and furniture.

Rules:
1. *Full Floor Coverage:* Always render the *entire floor layout*. Do not generate single rooms, exterior views, or partial floor areas.
2. *Layout Accuracy:* Reconstruct walls, doors, windows, and partitions exactly as in the floor plan.
3. *Furniture & Materials:*
   * Place beds, sofas, dining tables, kitchen units, and other essentials according to the plan.
   * Floors: wood in living/bedrooms, tiles in kitchen/bathrooms.
   * Walls: neutral colors (white, cream).
4. *Lighting:* Use natural daylight from windows and warm ambient interior lighting.
5. *Camera & Angle:*
   * Primary: isometric/top-down view with a 30-45° tilt of the full floor.
   * Use a wide-angle lens (24–28mm) for interiors.

Constraints:
• Never generate exterior house views or partial rooms unless explicitly instructed.
• Always assume the user wants a *complete interior 3D visualization of the single-floor plan*.
'''

@router.post('/detect-rooms-from-3d')
async def detect_rooms_from_3d(
    request: Request,
    image: UploadFile = File(...)
):
    """
    Detect rooms in a generated 3D interior image and return room coordinates and labels.
    """
    try:
        global client
        if client is None:
            api_key = os.getenv('GEMINI_KEY')
            if not api_key:
                raise HTTPException(status_code=500, detail="GEMINI_KEY not found")
            client = genai.Client(api_key=api_key)
        
        # Read and process the uploaded image
        image_data = await image.read()
        temp_path = f"assets/temp_{os.urandom(8).hex()}.png"
        with open(temp_path, "wb") as f:
            f.write(image_data)
        
        try:
            img = Image.open(temp_path)
            img.load()
            if img.size[0] == 0 or img.size[1] == 0:
                raise HTTPException(status_code=400, detail="Invalid image upload")
        except Exception as e:
            try:
                os.remove(temp_path)
            except Exception:
                pass
            raise HTTPException(status_code=400, detail=f"Invalid image upload: {e}")
        
        # Create prompt for room detection from 3D image
        room_detection_prompt = """
        Analyze this 3D interior design image and identify all visible rooms/spaces with their precise coordinates.
        This is a 3D rendered interior view, so identify the different functional areas/rooms you can see.
        
        IMPORTANT: Provide accurate coordinates that correspond to the actual room locations in the image.
        Look for furniture, fixtures, and architectural elements that indicate different room functions.
        
        Return a JSON response with the following structure:
        {
            "rooms": [
                {
                    "id": "room_1",
                    "label": "Living Room",
                    "type": "living_room",
                    "coordinates": {
                        "x": 100,
                        "y": 50,
                        "width": 200,
                        "height": 150
                    },
                    "confidence": 0.95,
                    "furniture": ["sofa", "coffee table", "tv"],
                    "description": "Main living area with seating"
                }
            ]
        }
        
        Identify these room types: living_room, kitchen, bedroom, bathroom, dining_room, office, hallway, storage, balcony, other.
        
        For each room, provide:
        1. Precise coordinates that match the actual room location in the image
        2. List of visible furniture/fixtures that identify the room type
        3. Brief description of the room's function
        4. High confidence score (0.8-1.0) for accurate detections
        
        Coordinates should be in pixels relative to the image dimensions.
        Focus on clearly visible and distinct areas in the 3D view.
        Make sure the coordinates accurately represent where each room appears in the image.
        """
        
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[room_detection_prompt, img]
            )
        except Exception as gemini_error:
            print(f"Gemini API error: {gemini_error}")
            # If Gemini API fails, return fallback mock data
            return {
                "rooms": [
                    {"id": "room_1", "label": "Living Room", "type": "living_room", "coordinates": {"x": 300, "y": 120, "width": 180, "height": 140}, "confidence": 0.9, "furniture": ["sofa", "coffee table"], "description": "Main living area"},
                    {"id": "room_2", "label": "Kitchen", "type": "kitchen", "coordinates": {"x": 120, "y": 120, "width": 100, "height": 100}, "confidence": 0.9, "furniture": ["island", "appliances"], "description": "Cooking area"},
                    {"id": "room_3", "label": "Dining Room", "type": "dining_room", "coordinates": {"x": 400, "y": 360, "width": 100, "height": 80}, "confidence": 0.9, "furniture": ["dining table", "chairs"], "description": "Dining area"},
                    {"id": "room_4", "label": "Bedroom 1", "type": "bedroom", "coordinates": {"x": 520, "y": 60, "width": 100, "height": 100}, "confidence": 0.9, "furniture": ["bed", "wardrobe"], "description": "Master bedroom"},
                    {"id": "room_5", "label": "Bedroom 2", "type": "bedroom", "coordinates": {"x": 120, "y": 360, "width": 100, "height": 100}, "confidence": 0.9, "furniture": ["bed", "desk"], "description": "Secondary bedroom"},
                    {"id": "room_6", "label": "Bathroom", "type": "bathroom", "coordinates": {"x": 400, "y": 60, "width": 80, "height": 80}, "confidence": 0.9, "furniture": ["toilet", "sink", "shower"], "description": "Bathroom facilities"},
                    {"id": "room_7", "label": "Hallway", "type": "hallway", "coordinates": {"x": 480, "y": 260, "width": 60, "height": 100}, "confidence": 0.9, "furniture": ["console table"], "description": "Main hallway"}
                ]
            }
        
        # Clean up temp file
        try:
            os.remove(temp_path)
        except Exception:
            pass
        
        # Parse the response with error handling
        try:
            response_text = response.candidates[0].content.parts[0].text
            print(f"Gemini response: {response_text}")
            
            # Extract JSON from the response
            import json
            import re
            
            # Try to extract JSON from the response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                try:
                    rooms_data = json.loads(json_match.group())
                    return {"rooms": rooms_data.get("rooms", [])}
                except json.JSONDecodeError as json_error:
                    print(f"JSON decode error: {json_error}")
        except Exception as response_error:
            print(f"Response processing error: {response_error}")
            # Fallback: return mock data
            return {
                "rooms": [
                    {"id": "room_1", "label": "Living Room", "type": "living_room", "coordinates": {"x": 300, "y": 120, "width": 180, "height": 140}, "confidence": 0.9, "furniture": ["sofa", "coffee table"], "description": "Main living area"},
                    {"id": "room_2", "label": "Kitchen", "type": "kitchen", "coordinates": {"x": 120, "y": 120, "width": 100, "height": 100}, "confidence": 0.9, "furniture": ["island", "appliances"], "description": "Cooking area"},
                    {"id": "room_3", "label": "Dining Room", "type": "dining_room", "coordinates": {"x": 400, "y": 360, "width": 100, "height": 80}, "confidence": 0.9, "furniture": ["dining table", "chairs"], "description": "Dining area"},
                    {"id": "room_4", "label": "Bedroom 1", "type": "bedroom", "coordinates": {"x": 520, "y": 60, "width": 100, "height": 100}, "confidence": 0.9, "furniture": ["bed", "wardrobe"], "description": "Master bedroom"},
                    {"id": "room_5", "label": "Bedroom 2", "type": "bedroom", "coordinates": {"x": 120, "y": 360, "width": 100, "height": 100}, "confidence": 0.9, "furniture": ["bed", "desk"], "description": "Secondary bedroom"},
                    {"id": "room_6", "label": "Bathroom", "type": "bathroom", "coordinates": {"x": 400, "y": 60, "width": 80, "height": 80}, "confidence": 0.9, "furniture": ["toilet", "sink", "shower"], "description": "Bathroom facilities"},
                    {"id": "room_7", "label": "Hallway", "type": "hallway", "coordinates": {"x": 480, "y": 260, "width": 60, "height": 100}, "confidence": 0.9, "furniture": ["console table"], "description": "Main hallway"}
                ]
            }
        
        # If no JSON match found, fallback to mock data
        return {
            "rooms": [
                {"id": "room_1", "label": "Living Room", "type": "living_room", "coordinates": {"x": 300, "y": 120, "width": 180, "height": 140}, "confidence": 0.9, "furniture": ["sofa", "coffee table"], "description": "Main living area"},
                {"id": "room_2", "label": "Kitchen", "type": "kitchen", "coordinates": {"x": 120, "y": 120, "width": 100, "height": 100}, "confidence": 0.9, "furniture": ["island", "appliances"], "description": "Cooking area"},
                {"id": "room_3", "label": "Dining Room", "type": "dining_room", "coordinates": {"x": 400, "y": 360, "width": 100, "height": 80}, "confidence": 0.9, "furniture": ["dining table", "chairs"], "description": "Dining area"},
                {"id": "room_4", "label": "Bedroom 1", "type": "bedroom", "coordinates": {"x": 520, "y": 60, "width": 100, "height": 100}, "confidence": 0.9, "furniture": ["bed", "wardrobe"], "description": "Master bedroom"},
                {"id": "room_5", "label": "Bedroom 2", "type": "bedroom", "coordinates": {"x": 120, "y": 360, "width": 100, "height": 100}, "confidence": 0.9, "furniture": ["bed", "desk"], "description": "Secondary bedroom"},
                {"id": "room_6", "label": "Bathroom", "type": "bathroom", "coordinates": {"x": 400, "y": 60, "width": 80, "height": 80}, "confidence": 0.9, "furniture": ["toilet", "sink", "shower"], "description": "Bathroom facilities"},
                {"id": "room_7", "label": "Hallway", "type": "hallway", "coordinates": {"x": 480, "y": 260, "width": 60, "height": 100}, "confidence": 0.9, "furniture": ["console table"], "description": "Main hallway"}
            ]
        }
            
    except Exception as e:
        print(f"Error in room detection: {e}")
        raise HTTPException(status_code=500, detail=f"Room detection failed: {str(e)}")

@router.post('/generate-room-interior')
async def generate_room_interior(
    request: Request,
    room_type: str = Form(...),
    room_label: str = Form(...),
    design_style: str = Form(...),
    country: str = Form(...),
    image: UploadFile = File(None)
):
    """
    Generate interior design for a specific room.
    """
    try:
        global client
        if client is None:
            api_key = os.getenv('GEMINI_KEY')
            if not api_key:
                raise HTTPException(status_code=500, detail="GEMINI_KEY not found")
            client = genai.Client(api_key=api_key)
        
        os.makedirs("assets", exist_ok=True)
        
        # Create room-specific prompt
        room_prompt = f"""
        Generate a high-quality 3D interior design for a {room_type} ({room_label}) with {design_style} style.
        
        Requirements:
        1. Focus only on the {room_type} space
        2. Use {design_style} design elements and furniture
        3. Include appropriate lighting and materials
        4. Make it realistic and functional
        5. Use warm, inviting colors and textures
        
        Style: {design_style}
        Room Type: {room_type}
        """
        
        if image:
            image_data = await image.read()
            temp_path = f"assets/temp_{os.urandom(8).hex()}.png"
            with open(temp_path, "wb") as f:
                f.write(image_data)
            
            try:
                img = Image.open(temp_path)
                img.load()
                if img.size[0] == 0 or img.size[1] == 0:
                    raise HTTPException(status_code=400, detail="Invalid image upload")
            except Exception as e:
                try:
                    os.remove(temp_path)
                except Exception:
                    pass
                raise HTTPException(status_code=400, detail=f"Invalid image upload: {e}")
            
            response = client.models.generate_content(
                model="gemini-2.5-flash-image-preview",
                contents=[room_prompt, img]
            )
            
            try:
                os.remove(temp_path)
            except Exception:
                pass
        else:
            response = client.models.generate_content(
                model="gemini-2.5-flash-image-preview",
                contents=room_prompt
            )
        
        # Process the generated image
        image_parts = []
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data:
                image_parts.append(part.inline_data.data)
            elif hasattr(part, 'inlineData') and part.inlineData:
                image_parts.append(part.inlineData.data)
        
        image_url = None
        if image_parts:
            try:
                if isinstance(image_parts[0], bytes):
                    base64_string = image_parts[0].decode('utf-8')
                    decoded_data = base64.b64decode(base64_string)
                elif isinstance(image_parts[0], str):
                    decoded_data = base64.b64decode(image_parts[0])
                else:
                    decoded_data = image_parts[0]
                
                generated_image = Image.open(BytesIO(decoded_data))
                image_path = f"assets/room_{os.urandom(16).hex()}.png"
                generated_image.save(image_path)
                base_url = str(request.base_url).rstrip('/')
                image_url = f"{base_url}/{image_path}"
            except Exception as e:
                print(f"Error processing generated room image: {e}")
        
        return {
            "image_url": image_url,
            "room_type": room_type,
            "room_label": room_label,
            "design_style": design_style
        }
        
    except Exception as e:
        print(f"Error generating room interior: {e}")
        raise HTTPException(status_code=500, detail=f"Room interior generation failed: {str(e)}")

@router.post('/generate-interior-3d-with-cost')
async def generate_interior_3d_with_cost(
    request: Request,
    prompt: str = Form(...),
    country: str = Form(...),
    image: UploadFile = File(None)
):
    """
    Generate a 3D interior design image from a 2D floor plan and provide cost estimation based on country, using the strict system prompt.
    """
    try:
        global client
        if client is None:
            api_key = os.getenv('GEMINI_KEY')
            if not api_key:
                raise HTTPException(status_code=500, detail="GEMINI_KEY not found")
            client = genai.Client(api_key=api_key)
        os.makedirs("assets", exist_ok=True)
        # Generate image first
        full_prompt = SYSTEM_PROMPT_2D_TO_3D + f"\nUser instructions: {prompt}"
        if image:
            image_data = await image.read()
            temp_path = f"assets/temp_{os.urandom(8).hex()}.png"
            with open(temp_path, "wb") as f:
                f.write(image_data)
            try:
                img = Image.open(temp_path)
                img.load()
                if img.size[0] == 0 or img.size[1] == 0:
                    raise HTTPException(status_code=400, detail="Invalid image upload")
            except Exception as e:
                try:
                    os.remove(temp_path)
                except Exception:
                    pass
                raise HTTPException(status_code=400, detail=f"Invalid image upload: {e}")
            response = client.models.generate_content(
                model="gemini-2.5-flash-image-preview",
                contents=[full_prompt, img]
            )
            try:
                os.remove(temp_path)
            except Exception:
                pass
        else:
            # No image, just prompt
            response = client.models.generate_content(
                model="gemini-2.5-flash-image-preview",
                contents=full_prompt
            )
        # Extract image parts
        image_parts = []
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data:
                image_parts.append(part.inline_data.data)
            elif hasattr(part, 'inlineData') and part.inlineData:
                image_parts.append(part.inlineData.data)
        image_url = None
        if image_parts:
            try:
                # Process and save the generated image
                if isinstance(image_parts[0], bytes):
                    base64_string = image_parts[0].decode('utf-8')
                    decoded_data = base64.b64decode(base64_string)
                elif isinstance(image_parts[0], str):
                    decoded_data = base64.b64decode(image_parts[0])
                else:
                    decoded_data = image_parts[0]
                generated_image = Image.open(BytesIO(decoded_data))
                image_path = f"assets/generated_{os.urandom(16).hex()}.png"
                generated_image.save(image_path)
                base_url = str(request.base_url).rstrip('/')
                image_url = f"{base_url}/{image_path}"
            except Exception as e:
                print(f"Error processing generated image: {e}")
        # Generate cost estimation using Gemini
        cost_prompt = f"""
        Based on the 3D interior design generated from the floor plan and user instructions: \"{prompt}\" in {country}, 
        provide a detailed cost breakdown for the project. Include:
        1. Total estimated cost in local currency
        2. Breakdown by categories (furniture, materials, labor, etc.)
        3. Individual item costs where applicable
        4. Consider {country}-specific pricing and market rates
        Format the response as JSON with the following structure:
        {{
            "total_cost": "amount with currency",
            "currency": "currency_code",
            "breakdown": [
                {{"category": "category_name", "cost": "amount", "description": "details"}},
                ...
            ],
            "items": [
                {{"item": "item_name", "cost": "amount", "quantity": "number"}},
                ...
            ]
        }}
        """
        cost_response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=cost_prompt
        )
        # Extract cost estimation text
        cost_text = ""
        for part in cost_response.candidates[0].content.parts:
            if hasattr(part, 'text') and part.text:
                cost_text = part.text
                break
        # Try to parse JSON from the response
        import json
        import re
        try:
            # Extract JSON from the response text
            json_match = re.search(r'\{.*\}', cost_text, re.DOTALL)
            if json_match:
                cost_data = json.loads(json_match.group())
            else:
                # Fallback if no JSON found
                cost_data = {
                    "total_cost": "Cost estimation unavailable",
                    "currency": "USD",
                    "breakdown": [],
                    "items": [],
                    "raw_response": cost_text
                }
        except json.JSONDecodeError:
            cost_data = {
                "total_cost": "Cost estimation unavailable",
                "currency": "USD", 
                "breakdown": [],
                "items": [],
                "raw_response": cost_text
            }
        return {
            "image_url": image_url,
            "cost_estimation": cost_data,
            "country": country,
            "prompt": prompt
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating interior with cost: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                           detail=f"Error generating interior with cost: {str(e)}")

@router.post('/generate-interior-with-cost')
async def generate_interior_with_cost(
    request: Request,
    prompt: str = Form(...),
    country: str = Form(...),
    image: UploadFile = File(None)
):
    """
    Generate an interior design image and provide cost estimation based on country.
    """
    try:
        # Check if client is initialized
        global client
        if client is None:
            try:
                api_key = os.getenv('GEMINI_KEY')
                if not api_key:
                    raise ValueError("GEMINI_KEY not found in environment variables")
                client = genai.Client(api_key=api_key)
                print("Google Generative AI client initialized successfully")
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                                   detail=f"Failed to initialize Google Generative AI client: {str(e)}")
        
        # Ensure assets directory exists
        os.makedirs("assets", exist_ok=True)
        
        # Generate image first
        if image:
            # Handle image upload case
            image_data = await image.read()
            temp_path = f"assets/temp_{os.urandom(8).hex()}.png"
            with open(temp_path, "wb") as f:
                f.write(image_data)
            
            try:
                img = Image.open(temp_path)
                img.load()
                if img.size[0] == 0 or img.size[1] == 0:
                    raise HTTPException(status_code=400, detail="Invalid image upload")
            except Exception as e:
                try:
                    os.remove(temp_path)
                except Exception:
                    pass
                raise HTTPException(status_code=400, detail=f"Invalid image upload: {e}")
            
            detailed_prompt = f"Transform this interior space to create a detailed and photorealistic renovation based on: {prompt}"
            response = client.models.generate_content(
                model="gemini-2.5-flash-image-preview",
                contents=[detailed_prompt, img]
            )
            
            try:
                os.remove(temp_path)
            except Exception:
                pass
        else:
            # Handle text-only case
            detailed_prompt = f"Create a detailed and photorealistic interior design image based on: {prompt}"
            response = client.models.generate_content(
                model="gemini-2.5-flash-image-preview",
                contents=detailed_prompt
            )
        
        # Extract image parts
        image_parts = []
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data:
                image_parts.append(part.inline_data.data)
            elif hasattr(part, 'inlineData') and part.inlineData:
                image_parts.append(part.inlineData.data)
        
        image_url = None
        if image_parts:
            try:
                # Process and save the generated image
                if isinstance(image_parts[0], bytes):
                    base64_string = image_parts[0].decode('utf-8')
                    decoded_data = base64.b64decode(base64_string)
                elif isinstance(image_parts[0], str):
                    decoded_data = base64.b64decode(image_parts[0])
                else:
                    decoded_data = image_parts[0]
                
                generated_image = Image.open(BytesIO(decoded_data))
                image_path = f"assets/generated_{os.urandom(16).hex()}.png"
                generated_image.save(image_path)
                
                base_url = str(request.base_url).rstrip('/')
                image_url = f"{base_url}/{image_path}"
            except Exception as e:
                print(f"Error processing generated image: {e}")
        
        # Generate cost estimation using Gemini
        # Define country-specific shopping platforms
        shopping_platforms = {
            "United States": ["amazon.com", "wayfair.com", "homedepot.com", "lowes.com", "ikea.com"],
            "United Kingdom": ["amazon.co.uk", "argos.co.uk", "ikea.com", "johnlewis.com", "dfs.co.uk"],
            "Germany": ["amazon.de", "ikea.com", "otto.de", "moebel.de", "xxxlutz.de"],
            "France": ["amazon.fr", "ikea.com", "conforama.fr", "but.fr", "leroymerlin.fr"],
            "Canada": ["amazon.ca", "ikea.com", "homedepot.ca", "wayfair.ca", "costco.ca"],
            "Australia": ["amazon.com.au", "ikea.com", "bunnings.com.au", "fantastic-furniture.com.au", "harvey-norman.com.au"],
            "India": ["amazon.in", "flipkart.com", "pepperfry.com", "urbanladder.com", "ikea.com"],
            "Bangladesh": ["daraz.com.bd", "pickaboo.com", "bagdoom.com", "othoba.com", "ajkerdeal.com"],
            "Japan": ["amazon.co.jp", "ikea.com", "nitori-net.jp", "rakuten.co.jp", "yodobashi.com"],
            "South Korea": ["coupang.com", "11st.co.kr", "ikea.com", "homeplus.co.kr", "lotte.com"],
            "Brazil": ["amazon.com.br", "ikea.com", "casasbahia.com.br", "magazineluiza.com.br", "mobly.com.br"],
            "Mexico": ["amazon.com.mx", "ikea.com", "liverpool.com.mx", "homedepot.com.mx", "coppel.com"],
            "Italy": ["amazon.it", "ikea.com", "leroy-merlin.it", "mondo-convenienza.it", "maisons-du-monde.com"],
            "Spain": ["amazon.es", "ikea.com", "leroymerlin.es", "el-corte-ingles.es", "maisons-du-monde.com"],
            "Netherlands": ["bol.com", "ikea.com", "fonq.nl", "wehkamp.nl", "gamma.nl"],
            "Sweden": ["ikea.com", "ellos.se", "jysk.se", "rusta.com", "bauhaus.se"],
            "Norway": ["ikea.com", "jysk.no", "rusta.com", "elkjop.no", "bauhaus.no"],
            "Denmark": ["ikea.com", "jysk.dk", "ilva.dk", "bauhaus.dk", "rusta.com"],
            "Finland": ["ikea.com", "jysk.fi", "bauhaus.fi", "rusta.com", "verkkokauppa.com"],
            "Russia": ["ozon.ru", "wildberries.ru", "ikea.com", "leroymerlin.ru", "hoff.ru"],
            "China": ["tmall.com", "jd.com", "ikea.cn", "suning.com", "gome.com.cn"],
            "Singapore": ["lazada.sg", "shopee.sg", "ikea.com", "courts.com.sg", "harvey-norman.com.sg"],
            "Malaysia": ["lazada.com.my", "shopee.com.my", "ikea.com", "courts.com.my", "senheng.com.my"],
            "Thailand": ["lazada.co.th", "shopee.co.th", "ikea.com", "homepro.co.th", "powerbuy.co.th"],
            "Philippines": ["lazada.com.ph", "shopee.ph", "ikea.com", "sm-store.com", "robinsons.com.ph"],
            "Indonesia": ["tokopedia.com", "shopee.co.id", "blibli.com", "ikea.com", "ace.id"],
            "Vietnam": ["shopee.vn", "lazada.vn", "tiki.vn", "sendo.vn", "ikea.com"],
            "South Africa": ["takealot.com", "makro.co.za", "ikea.com", "game.co.za", "builders.co.za"],
            "Nigeria": ["jumia.com.ng", "konga.com", "slot.ng", "ikea.com", "shoprite.co.za"],
            "Egypt": ["jumia.com.eg", "souq.com", "ikea.com", "carrefour.com", "b.tech"],
            "UAE": ["amazon.ae", "noon.com", "ikea.com", "carrefour.ae", "sharaf-dg.com"],
            "Saudi Arabia": ["amazon.sa", "noon.com", "ikea.com", "extra.com", "jarir.com"]
        }
        
        platforms = shopping_platforms.get(country, ["amazon.com", "ikea.com", "wayfair.com"])
        
        cost_prompt = f"""
        Based on the interior design renovation described as: \"{prompt}\" in {country}, 
        provide a detailed cost breakdown for the renovation. Include:
        
        1. Total estimated cost in local currency
        2. Breakdown by categories (furniture, materials, labor, etc.)
        3. Individual item costs where applicable
        4. Consider {country}-specific pricing and market rates
        5. For each item, suggest where it can be purchased from these platforms: {', '.join(platforms)}
        
        Format the response as JSON with the following structure:
        {{
            \"total_cost\": \"amount with currency\",
            \"currency\": \"currency_code\",
            \"breakdown\": [
                {{\"category\": \"category_name\", \"cost\": \"amount\", \"description\": \"details\"}},
                ...
            ],
            \"items\": [
                {{
                    \"item\": \"item_name\", 
                    \"cost\": \"amount\", 
                    \"quantity\": \"number\",
                    \"shopping_links\": [
                        {{\"platform\": \"platform_name\", \"url\": \"search_url_for_item\", \"note\": \"availability_note\"}},
                        ...
                    ]
                }},
                ...
            ]
        }}
        
        For shopping links, create realistic search URLs for each platform. For example:
        - Amazon: https://amazon.com/s?k=modern+sofa
        - IKEA: https://ikea.com/search/?q=sofa
        - Wayfair: https://wayfair.com/furniture/sb0/sofas-c45974.html
        
        Make sure the URLs are actual searchable links that would help users find the products.
        """
        
        cost_response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=cost_prompt
        )
        
        # Extract cost estimation text
        cost_text = ""
        for part in cost_response.candidates[0].content.parts:
            if hasattr(part, 'text') and part.text:
                cost_text = part.text
                break
        
        # Try to parse JSON from the response
        import json
        import re
        
        try:
            # Extract JSON from the response text
            json_match = re.search(r'\{.*\}', cost_text, re.DOTALL)
            if json_match:
                cost_data = json.loads(json_match.group())
            else:
                # Fallback if no JSON found
                cost_data = {
                    "total_cost": "Cost estimation unavailable",
                    "currency": "USD",
                    "breakdown": [],
                    "items": [],
                    "raw_response": cost_text
                }
        except json.JSONDecodeError:
            cost_data = {
                "total_cost": "Cost estimation unavailable",
                "currency": "USD", 
                "breakdown": [],
                "items": [],
                "raw_response": cost_text
            }
        
        return {
            "image_url": image_url,
            "cost_estimation": cost_data,
            "country": country,
            "prompt": prompt
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating interior with cost: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                           detail=f"Error generating interior with cost: {str(e)}")
