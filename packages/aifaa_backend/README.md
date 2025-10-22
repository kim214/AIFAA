# AIFAA Backend

This is the backend service for the **AIFAA**, an application designed to assist users in first aid and emergency situations.  
The backend provides APIs for AI chat assistance, first aid library access, user management, and emergency response handling.



##  Tech Stack

- **Language:** Python 3.10+
- **Framework:** FastAPI
- **Database:** PostgreSQL (via SQLAlchemy ORM)
- **ORM / Validation:** SQLAlchemy & Pydantic
- **AI Integration:** OpenAI / Hugging Face (configurable)
- **Server:** Uvicorn
- **Environment Management:** `venv`

---

## Project Structure

backend/
├── README.md
├── requirements.txt
├── venv/
│
└── src/
├── config.py
├── db/
│ ├── database.py
│ ├── models.py
│ ├── schemas.py
│ └── init.py
│
├── models/
│ ├── ai.py
│ └── init.py
│
├── repositories/
│ ├── user_repository.py
│ ├── emergency_repository.py
│ ├── library_repository.py
│ └── init.py
│
├── routers/
│ ├── user_router.py
│ ├── emergency_router.py
│ ├── chatbot_router.py
│ ├── library_router.py
│ └── init.py
│
├── services/
│ ├── ai_service.py
│ ├── emergency_service.py
│ ├── user_service.py
│ ├── library_service.py
│ └── init.py
│
└── main.py

## Setup Instructions 

### 1. Create a virtual environment
assuming you've cloned the repo already:
```bash
python -m venv venv
source /venv/bin/activate #Linux/macOS
venv\Scripts\activate  #Windows
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Set up environment variables
Create a .env file in the src/ directory add the keys sent to you by the admin

### 4. Run db migrations
```bash
alembic upgrade head
```

### 5. Start the development server
```bash
uvicorn src.main:app --reload
```


## Key Features
🧠 AI Chatbot Integration — Handles first aid and emergency questions using AI.

📚 First Aid Library — Structured library of verified first aid information.

🚨 Emergency Module — Initiate and manage emergency calls or responses.

👤 User Management — Authentication and language preferences.

🌍 Localization — Multi-language support for global accessibility.

📍 Location Access — Optional geolocation features for emergency services.



## Code Layers
**Layer**		    **Description**
db/		            Database models, schemas, and connections
repositories/	    Data access layer (CRUD)
services/	        Business logic, connects routes and data
routers/	        API route definitions
config.py	        App configuration and environment variables
main.py		        FastAPI entry point


## Testing
```bash 
pytest -v
```
To create a test database, use conftest.py and SQLAlchemy’s sessionmaker.


## Security Notes
Never commit .env or API keys to source control.

Use HTTPS for all production deployments.

Validate all user inputs through Pydantic schemas.


## Next Steps
Add authentication (JWT or OAuth2)
Integrate AI model API
Build documentation using FASTAPI's Swagger UI
Deploy to a cloud provider
