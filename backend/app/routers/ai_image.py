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
        cost_prompt = f"""
        Based on the interior design renovation described as: "{prompt}" in {country}, 
        provide a detailed cost breakdown for the renovation. Include:
        
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
