# Interior AI Backend

A FastAPI-based backend service for an Interior Design AI application that provides image generation, room detection, cost estimation, and user management capabilities.

## 🌟 Features

- **AI-Powered Image Generation**: Generate interior designs from text prompts or existing images using Google Gemini AI
- **3D Interior Visualization**: Convert 2D floor plans to realistic 3D interior designs
- **Room Detection**: Automatically detect and label rooms in 3D interior images
- **Cost Estimation**: Provide detailed cost breakdowns with shopping links for different countries
- **User Management**: Complete authentication and authorization system
- **Photo Management**: Upload and manage interior design photos
- **Booking System**: Handle service bookings and appointments
- **Shop Integration**: Connect with nearby interior design shops

## 🏗️ Architecture

The backend is built using:

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)
- **Alembic**: Database migration tool
- **PostgreSQL**: Primary database (configurable)
- **Google Gemini AI**: For image generation and AI capabilities
- **JWT Authentication**: Secure token-based authentication
- **Docker**: Containerization for easy deployment

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── oauth2.py            # JWT authentication
│   ├── utils.py             # Utility functions
│   └── routers/             # API route modules
│       ├── __init__.py
│       ├── auth.py          # Authentication endpoints
│       ├── user.py          # User management
│       ├── photo.py         # Photo management
│       ├── booking.py       # Booking system
│       ├── ai_image.py      # AI image generation
│       └── shops.py         # Shop integration
├── alembic/                 # Database migrations
├── assets/                  # Generated images and files
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
├── cloudbuild.yaml         # Google Cloud Build config
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL (or SQLite for development)
- Google Gemini API key

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kaggle-banana/backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env  # Create from template
   ```

   Configure the following variables in `.env`:

   ```env
   DATABASE_URL=postgresql://user:password@localhost/interior_ai
   SECRET_KEY=your_secret_key_here
   GEMINI_KEY=your_google_gemini_api_key
   MAP_API_KEY=your_google_maps_api_key
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_MINUTES=10080
   ```

5. **Run database migrations**

   ```bash
   alembic upgrade head
   ```

6. **Start the development server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### Using Docker

1. **Build the Docker image**

   ```bash
   docker build -t interior-ai-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 8000:8000 \
     -e DATABASE_URL=your_database_url \
     -e SECRET_KEY=your_secret_key \
     -e GEMINI_KEY=your_gemini_key \
     interior-ai-backend
   ```

## 📚 API Documentation

Once the server is running, you can access:

- **Interactive API Documentation**: `http://localhost:8000/docs`
- **Alternative API Documentation**: `http://localhost:8000/redoc`

### Key Endpoints

#### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

#### AI Image Generation

- `POST /api/v1/generate-image-prompt` - Generate image from text prompt
- `POST /api/v1/generate-image-upload` - Generate image from uploaded image + prompt
- `POST /api/v1/generate-interior-3d-with-cost` - Generate 3D interior from 2D floor plan with cost estimation
- `POST /api/v1/generate-interior-with-cost` - Generate interior design with cost breakdown
- `POST /api/v1/detect-rooms-from-3d` - Detect rooms in 3D interior images
- `POST /api/v1/generate-room-interior` - Generate specific room interior design

#### User Management

- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile

#### Photo Management

- `POST /api/v1/photos` - Upload photos
- `GET /api/v1/photos` - List photos
- `DELETE /api/v1/photos/{id}` - Delete photo

#### Booking System

- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - List user bookings
- `PUT /api/v1/bookings/{id}` - Update booking status

## 🗄️ Database Models

### User

- `id`: Primary key
- `username`: User's display name
- `email`: User's email address
- `password`: Hashed password
- `role`: User role (admin, user, etc.)

### Booking

- `id`: Primary key
- `user_id`: Foreign key to User
- `date`: Booking date
- `service_type`: Type of service
- `status`: Booking status

### Photo

- `id`: Primary key
- `photo`: Image file path/URL
- `title`: Photo title
- `description`: Photo description
- `category`: Photo category

## 🚀 Deployment

### Google Cloud Platform

The project includes a `cloudbuild.yaml` for automated deployment to Google Cloud Run:

1. **Set up Google Cloud Build triggers**
2. **Configure the required substitution variables**:

   - `_SERVICE_NAME`: Cloud Run service name
   - `_REPOSITORY_NAME`: Container registry repository
   - `_DATABASE_URL`: Production database URL
   - `_SECRET_KEY`: Production secret key
   - `_GEMINI_KEY`: Google Gemini API key
   - `_MAP_API_KEY`: Google Maps API key

3. **Deploy automatically on git push**

### Manual Docker Deployment

```bash
# Build and tag the image
docker build -t interior-ai-backend .

# Push to container registry
docker tag interior-ai-backend gcr.io/your-project/interior-ai-backend
docker push gcr.io/your-project/interior-ai-backend

# Deploy to Cloud Run
gcloud run deploy interior-ai-backend \
  --image gcr.io/your-project/interior-ai-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔧 Configuration

### Environment Variables

| Variable                       | Description                | Default               |
| ------------------------------ | -------------------------- | --------------------- |
| `DATABASE_URL`                 | Database connection string | `sqlite:///./test.db` |
| `SECRET_KEY`                   | JWT secret key             | Required              |
| `GEMINI_KEY`                   | Google Gemini API key      | Required              |
| `MAP_API_KEY`                  | Google Maps API key        | Optional              |
| `ACCESS_TOKEN_EXPIRE_MINUTES`  | JWT access token expiry    | `30`                  |
| `REFRESH_TOKEN_EXPIRE_MINUTES` | JWT refresh token expiry   | `10080`               |
| `MAX_UPLOAD_SIZE_MB`           | Maximum file upload size   | `10`                  |

### Database Configuration

The application supports both PostgreSQL and SQLite:

- **Development**: SQLite (`sqlite:///./test.db`)
- **Production**: PostgreSQL (`postgresql://user:password@host/database`)

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_auth.py
```

## 📝 API Usage Examples

### Generate Interior Design with Cost Estimation

```python
import requests

# Generate interior with cost breakdown
response = requests.post(
    "http://localhost:8000/api/v1/generate-interior-with-cost",
    data={
        "prompt": "Modern minimalist living room with Scandinavian furniture",
        "country": "United States"
    }
)

result = response.json()
print(f"Generated image: {result['image_url']}")
print(f"Total cost: {result['cost_estimation']['total_cost']}")
```

### Upload and Transform Image

```python
import requests

# Transform existing interior image
with open("room.jpg", "rb") as f:
    response = requests.post(
        "http://localhost:8000/api/v1/generate-image-upload",
        data={"prompt": "Transform this into a luxury bedroom"},
        files={"image": f}
    )

result = response.json()
print(f"Transformed image: {result['image_url']}")
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/docs`

## 🔄 Version History

- **v1.0.0**: Initial release with basic AI image generation
- **v1.1.0**: Added cost estimation and room detection
- **v1.2.0**: Enhanced 3D interior generation capabilities

---

Built with ❤️ using FastAPI and Google Gemini AI
