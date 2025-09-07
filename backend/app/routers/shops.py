from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Pydantic models
class ShopLocation(BaseModel):
    latitude: float
    longitude: float

class ShopItem(BaseModel):
    name: str
    category: str

class Shop(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    category: str
    description: str
    rating: float
    distance: str
    phone: Optional[str] = None
    hours: Optional[str] = None
    address: str
    items: List[str]
    website: Optional[str] = None
    price_level: Optional[int] = None

class ShopsResponse(BaseModel):
    shops: List[Shop]
    total_count: int
    location: ShopLocation

# Static fallback data - Realistic US addresses and shop chains
STATIC_SHOPS = [
    {
        "id": "static_1",
        "name": "Home Depot",
        "latitude": 40.7589,
        "longitude": -73.9851,
        "category": "Hardware & Tools",
        "description": "Complete home improvement store with tools, materials, and expert advice",
        "rating": 4.5,
        "distance": "0.8 km",
        "phone": "+1 (212) 555-0123",
        "hours": "Mon-Sun: 6AM-10PM",
        "address": "1234 Broadway, New York, NY 10001",
        "items": ["Paint", "Flooring", "Hardware", "Tools", "Lighting"],
        "website": "https://homedepot.com",
        "price_level": 2
    },
    {
        "id": "static_2",
        "name": "Lowe's",
        "latitude": 40.7505,
        "longitude": -73.9934,
        "category": "Building Materials",
        "description": "Building supplies, appliances, and home improvement products",
        "rating": 4.3,
        "distance": "1.2 km",
        "phone": "+1 (212) 555-0234",
        "hours": "Mon-Sun: 6AM-9PM",
        "address": "456 6th Ave, New York, NY 10011",
        "items": ["Appliances", "Flooring", "Cabinets", "Countertops", "Paint"],
        "website": "https://lowes.com",
        "price_level": 2
    },
    {
        "id": "static_3",
        "name": "IKEA",
        "latitude": 40.7614,
        "longitude": -73.9776,
        "category": "Furniture & Decor",
        "description": "Modern furniture, home accessories, and interior design solutions",
        "rating": 4.2,
        "distance": "2.1 km",
        "phone": "+1 (212) 555-0345",
        "hours": "Mon-Sun: 10AM-9PM",
        "address": "789 3rd Ave, New York, NY 10017",
        "items": ["Furniture", "Storage", "Lighting", "Decor", "Kitchen"],
        "website": "https://ikea.com",
        "price_level": 1
    },
    {
        "id": "static_4",
        "name": "Sherwin Williams",
        "latitude": 40.7282,
        "longitude": -74.0776,
        "category": "Paint & Coatings",
        "description": "Professional paint, stains, and coating solutions",
        "rating": 4.6,
        "distance": "1.8 km",
        "phone": "+1 (212) 555-0456",
        "hours": "Mon-Fri: 7AM-6PM, Sat: 8AM-5PM",
        "address": "321 Hudson St, New York, NY 10013",
        "items": ["Paint", "Stains", "Primers", "Brushes", "Rollers"],
        "website": "https://sherwin-williams.com",
        "price_level": 3
    },
    {
        "id": "static_5",
        "name": "Floor & Decor",
        "latitude": 40.7505,
        "longitude": -73.9934,
        "category": "Flooring Specialists",
        "description": "Hardwood, tile, carpet, and specialty flooring solutions",
        "rating": 4.4,
        "distance": "2.5 km",
        "phone": "+1 (212) 555-0567",
        "hours": "Mon-Sun: 7AM-8PM",
        "address": "654 8th Ave, New York, NY 10036",
        "items": ["Hardwood", "Tile", "Carpet", "Vinyl", "Laminate"],
        "website": "https://flooranddecor.com",
        "price_level": 2
    },
    {
        "id": "static_6",
        "name": "Menards",
        "latitude": 40.7614,
        "longitude": -73.9776,
        "category": "Hardware & Tools",
        "description": "Home improvement and building materials with competitive prices",
        "rating": 4.1,
        "distance": "1.5 km",
        "phone": "+1 (212) 555-0678",
        "hours": "Mon-Sun: 6AM-10PM",
        "address": "987 2nd Ave, New York, NY 10022",
        "items": ["Lumber", "Hardware", "Tools", "Electrical", "Plumbing"],
        "website": "https://menards.com",
        "price_level": 1
    },
    {
        "id": "static_7",
        "name": "Benjamin Moore",
        "latitude": 40.7505,
        "longitude": -73.9934,
        "category": "Paint & Coatings",
        "description": "Premium paint and color solutions for interior and exterior",
        "rating": 4.7,
        "distance": "1.9 km",
        "phone": "+1 (212) 555-0789",
        "hours": "Mon-Fri: 7AM-7PM, Sat: 8AM-6PM",
        "address": "147 5th Ave, New York, NY 10010",
        "items": ["Premium Paint", "Color Matching", "Stains", "Primers", "Brushes"],
        "website": "https://benjaminmoore.com",
        "price_level": 4
    },
    {
        "id": "static_8",
        "name": "West Elm",
        "latitude": 40.7282,
        "longitude": -74.0776,
        "category": "Furniture & Decor",
        "description": "Modern furniture and home decor with contemporary design",
        "rating": 4.0,
        "distance": "1.3 km",
        "phone": "+1 (212) 555-0890",
        "hours": "Mon-Sat: 10AM-9PM, Sun: 11AM-7PM",
        "address": "258 Spring St, New York, NY 10012",
        "items": ["Modern Furniture", "Decor", "Lighting", "Textiles", "Accessories"],
        "website": "https://westelm.com",
        "price_level": 3
    },
    {
        "id": "static_9",
        "name": "Pottery Barn",
        "latitude": 40.7505,
        "longitude": -73.9934,
        "category": "Furniture & Decor",
        "description": "Classic and contemporary home furnishings and decor",
        "rating": 4.3,
        "distance": "1.7 km",
        "phone": "+1 (212) 555-0901",
        "hours": "Mon-Sat: 10AM-8PM, Sun: 11AM-7PM",
        "address": "369 Lexington Ave, New York, NY 10017",
        "items": ["Furniture", "Bedding", "Decor", "Lighting", "Rugs"],
        "website": "https://potterybarn.com",
        "price_level": 4
    },
    {
        "id": "static_10",
        "name": "Bed Bath & Beyond",
        "latitude": 40.7614,
        "longitude": -73.9776,
        "category": "Home Goods",
        "description": "Home goods, bedding, and household essentials",
        "rating": 4.1,
        "distance": "2.3 km",
        "phone": "+1 (212) 555-1012",
        "hours": "Mon-Sun: 9AM-9PM",
        "address": "741 1st Ave, New York, NY 10016",
        "items": ["Bedding", "Bath", "Kitchen", "Storage", "Decor"],
        "website": "https://bedbathandbeyond.com",
        "price_level": 2
    }
]

# Renovation-related place types for Google Places API
RENOVATION_PLACE_TYPES = [
    "hardware_store",
    "home_goods_store", 
    "furniture_store",
    "paint_store",
    "flooring_store",
    "lighting_store",
    "kitchen_supply_store",
    "building_materials_store",
    "lumber_store",
    "electrical_supply_store",
    "plumbing_supply_store"
]

# Category mapping for renovation items
CATEGORY_MAPPING = {
    "Hardware & Tools": ["hardware_store", "building_materials_store", "lumber_store", "electrical_supply_store", "plumbing_supply_store"],
    "Building Materials": ["building_materials_store", "lumber_store", "hardware_store"],
    "Furniture & Decor": ["furniture_store", "home_goods_store"],
    "Paint & Coatings": ["paint_store", "hardware_store"],
    "Flooring Specialists": ["flooring_store", "home_goods_store"],
    "Lighting": ["lighting_store", "home_goods_store"],
    "Kitchen": ["kitchen_supply_store", "home_goods_store"]
}

async def fetch_google_places(latitude: float, longitude: float, radius: int = 5000, category: str = None) -> List[dict]:
    """Fetch renovation shops from Google Places API"""
    google_api_key = os.getenv("MAP_API_KEY")
    
    if not google_api_key:
        print("Google Places API key not found, using static data")
        return []
    
    try:
        # Determine place types based on category
        place_types = RENOVATION_PLACE_TYPES
        if category and category in CATEGORY_MAPPING:
            place_types = CATEGORY_MAPPING[category]
        
        shops = []
        
        # Search for each place type
        for place_type in place_types:
            url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            params = {
                "location": f"{latitude},{longitude}",
                "radius": radius,
                "type": place_type,
                "key": google_api_key
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                if data.get("status") == "OK":
                    for place in data.get("results", []):
                        # Get detailed information for each place
                        place_details = await get_place_details(place["place_id"], google_api_key)
                        if place_details:
                            shops.append(place_details)
        
        # Remove duplicates and limit results
        unique_shops = []
        seen_place_ids = set()
        
        for shop in shops:
            if shop["place_id"] not in seen_place_ids:
                seen_place_ids.add(shop["place_id"])
                unique_shops.append(shop)
                
                if len(unique_shops) >= 20:  # Limit to 20 shops
                    break
        
        return unique_shops
        
    except Exception as e:
        print(f"Error fetching Google Places data: {e}")
        return []

async def get_place_details(place_id: str, api_key: str) -> Optional[dict]:
    """Get detailed information for a specific place"""
    try:
        url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            "place_id": place_id,
            "fields": "name,geometry,rating,formatted_phone_number,opening_hours,formatted_address,website,price_level,types",
            "key": api_key
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") == "OK":
                result = data["result"]
                
                # Map Google place types to our categories
                category = map_place_types_to_category(result.get("types", []))
                
                # Generate renovation items based on category
                items = generate_renovation_items(category, result.get("types", []))
                
                return {
                    "place_id": place_id,
                    "name": result.get("name", "Unknown Store"),
                    "latitude": result["geometry"]["location"]["lat"],
                    "longitude": result["geometry"]["location"]["lng"],
                    "category": category,
                    "description": f"{category} store offering renovation and home improvement products",
                    "rating": result.get("rating", 0.0),
                    "distance": "Unknown",  # Will be calculated on frontend
                    "phone": result.get("formatted_phone_number"),
                    "hours": format_opening_hours(result.get("opening_hours", {})),
                    "address": result.get("formatted_address", "Address not available"),
                    "items": items,
                    "website": result.get("website"),
                    "price_level": result.get("price_level")
                }
                
    except Exception as e:
        print(f"Error getting place details for {place_id}: {e}")
        return None

def map_place_types_to_category(place_types: List[str]) -> str:
    """Map Google place types to our renovation categories"""
    type_to_category = {
        "hardware_store": "Hardware & Tools",
        "building_materials_store": "Building Materials", 
        "lumber_store": "Building Materials",
        "electrical_supply_store": "Hardware & Tools",
        "plumbing_supply_store": "Hardware & Tools",
        "furniture_store": "Furniture & Decor",
        "home_goods_store": "Furniture & Decor",
        "paint_store": "Paint & Coatings",
        "flooring_store": "Flooring Specialists",
        "lighting_store": "Lighting",
        "kitchen_supply_store": "Kitchen"
    }
    
    for place_type in place_types:
        if place_type in type_to_category:
            return type_to_category[place_type]
    
    return "Hardware & Tools"  # Default category

def generate_renovation_items(category: str, place_types: List[str]) -> List[str]:
    """Generate relevant renovation items based on category and place types"""
    item_mapping = {
        "Hardware & Tools": ["Tools", "Hardware", "Electrical", "Plumbing", "Lumber"],
        "Building Materials": ["Lumber", "Concrete", "Insulation", "Drywall", "Roofing"],
        "Furniture & Decor": ["Furniture", "Decor", "Storage", "Accessories", "Textiles"],
        "Paint & Coatings": ["Paint", "Stains", "Primers", "Brushes", "Rollers"],
        "Flooring Specialists": ["Hardwood", "Tile", "Carpet", "Vinyl", "Laminate"],
        "Lighting": ["Light Fixtures", "Bulbs", "Switches", "Outlets", "Cords"],
        "Kitchen": ["Cabinets", "Countertops", "Appliances", "Sinks", "Faucets"]
    }
    
    return item_mapping.get(category, ["General Renovation Items"])

def format_opening_hours(opening_hours: dict) -> str:
    """Format Google Places opening hours"""
    if not opening_hours or not opening_hours.get("weekday_text"):
        return "Hours not available"
    
    # Return first day's hours as example
    return opening_hours["weekday_text"][0] if opening_hours["weekday_text"] else "Hours not available"

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> str:
    """Calculate distance between two points (simplified)"""
    # Simple distance calculation for demo purposes
    import math
    
    R = 6371  # Earth's radius in kilometers
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    distance = R * c
    
    if distance < 1:
        return f"{int(distance * 1000)} m"
    else:
        return f"{distance:.1f} km"

@router.get("/shops/nearby", response_model=ShopsResponse)
async def get_nearby_shops(
    latitude: float = Query(..., description="User's latitude"),
    longitude: float = Query(..., description="User's longitude"),
    radius: int = Query(5000, description="Search radius in meters (default: 5000)"),
    category: Optional[str] = Query(None, description="Filter by renovation category")
):
    """
    Get nearby renovation shops based on user location.
    Falls back to static data if Google Places API is not available.
    """
    try:
        # Try to fetch from Google Places API first
        google_shops = await fetch_google_places(latitude, longitude, radius, category)
        
        if google_shops:
            # Use Google Places data
            shops_data = google_shops
        else:
            # Fall back to static data
            shops_data = STATIC_SHOPS.copy()
            
            # Filter by category if specified
            if category:
                shops_data = [shop for shop in shops_data if shop["category"] == category]
        
        # Calculate distances for all shops
        for shop in shops_data:
            shop["distance"] = calculate_distance(
                latitude, longitude, 
                shop["latitude"], shop["longitude"]
            )
        
        # Convert to Shop objects
        shops = [Shop(**shop) for shop in shops_data]
        
        return ShopsResponse(
            shops=shops,
            total_count=len(shops),
            location=ShopLocation(latitude=latitude, longitude=longitude)
        )
        
    except Exception as e:
        # Return static data as fallback
        shops_data = STATIC_SHOPS.copy()
        
        if category:
            shops_data = [shop for shop in shops_data if shop["category"] == category]
        
        # Calculate distances
        for shop in shops_data:
            shop["distance"] = calculate_distance(
                latitude, longitude, 
                shop["latitude"], shop["longitude"]
            )
        
        shops = [Shop(**shop) for shop in shops_data]
        
        return ShopsResponse(
            shops=shops,
            total_count=len(shops),
            location=ShopLocation(latitude=latitude, longitude=longitude)
        )

@router.get("/shops/categories")
async def get_shop_categories():
    """Get available renovation shop categories"""
    return {
        "categories": list(CATEGORY_MAPPING.keys()),
        "category_mapping": CATEGORY_MAPPING
    }
