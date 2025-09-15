# StageTFCManagementSystem
Project Structure
project-root/
├── front/              # React frontend
└── stage/              # Django backend
Steps to Run the Project
1. Navigate to the Frontend (React) Folder
cd front
2. Install Frontend Dependencies
npm install
3. Start the React Development Server
npm start
This will launch the React app at:
🔗 http://localhost:3000 
4. Navigate to the Backend (Django) Folder
cd stage
5. Install Backend Dependencies
pip install -r requirements.txt
Make sure you're in a virtual environment (recommended): 
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
6. Run Django Development Server
python manage.py runserver
This will launch the Django server at:
🔗 http://localhost:8000 
 
