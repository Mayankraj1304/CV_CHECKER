# Deployment

This project has two deployable apps:

- `Backend`: FastAPI API
- `Frontend`: Vite React web app

## Backend on Render

1. Push this repository to GitHub.
2. In Render, create a new Web Service from the repository.
3. Use these settings:
   - Root directory: `Backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add this environment variable after the frontend is deployed:
   - `CORS_ORIGINS=https://your-frontend-url`

The included `render.yaml` can also be used as a Render blueprint.

## Frontend on Vercel

1. Create a new Vercel project from the same repository.
2. Set the root directory to `Frontend`.
3. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add this environment variable:
   - `VITE_API_URL=https://your-render-backend-url`

Redeploy the frontend after adding `VITE_API_URL`.

## Local Production Check

Backend:

```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd Frontend
npm install
npm run build
```
