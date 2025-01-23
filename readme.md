
# Project Setup

1. **Clone the Repo**  
   - `git clone <your-repo-url>`
   - `cd <your-repo-directory>`

2. **Configure Postgres**  
   - Ensure Postgres is running (default on port `5432`).  
   - Edit `backend/backend/settings.py` to point to your Postgres instance.

3. **Backend Setup** (Django)  
   - `cd backend`  
   - (Optional) Create a virtual environment, then `pip install -r requirements.txt` or install dependencies manually.  
   - `python manage.py migrate`  
   - `python manage.py runserver` (runs at http://127.0.0.1:8000/)

4. **Frontend Setup** (React + Vite)  
   - `cd ../frontend`  
   - `npm install`  
   - `npm run dev` (runs at http://127.0.0.1:5173/)

Access the app at http://127.0.0.1:5173/ (frontend) communicating with http://127.0.0.1:8000/ (backend).
