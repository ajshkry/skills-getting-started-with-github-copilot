# Mergington High School Activities API

A super simple FastAPI application that lets students view and sign up for extracurricular activities.

This README clarifies where to run commands from (project root vs `src/`), how to install dependencies, and how to start the server.

## Quick overview

- Application entry: `src/app.py`
- Static frontend: `src/static/` (contains `index.html`, `app.js`, `styles.css`)
- Top-level `requirements.txt` lists needed Python packages

## Folder layout

From the repository root you'll find:

```
requirements.txt
src/
  app.py
  README.md        # (this file)
  static/
    index.html
    app.js
    styles.css
```

## Getting started (recommended)

1. From the repository root, create and activate a virtual environment (optional but recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies from the top-level `requirements.txt` (run from project root):

```bash
pip install -r requirements.txt
```

3. Run the application.

You have two common options depending on where you run the command from:

- From the repository root (recommended):

```bash
python src/app.py
```

- Or change into the `src/` folder and run there:

```bash
cd src
python app.py
```

4. Alternatively, run with `uvicorn` (useful for development with auto-reload):

If you run from the `src/` folder:

```bash
cd src
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

If you run `uvicorn` from the project root, point it at the module path:

```bash
uvicorn src.app:app --reload --host 127.0.0.1 --port 8000
```

5. Open the browser to see the API docs:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

| Method | Endpoint                                                          | Description                                                         |
| ------ | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| GET    | `/activities`                                                     | Get all activities with their details and current participant count |
| POST   | `/activities/{activity_name}/signup?email=student@mergington.edu` | Sign up for an activity                                             |

## Data model (in-memory)

- Activities (identified by name): description, schedule, max participants, list of signed-up student emails
- Students (identified by email): name, grade level

Because all data is stored in memory, the data will reset when the server restarts.

## Notes and troubleshooting

- If the server port 8000 is already in use, either stop the service using it or pass a different `--port` to `uvicorn`.
- If you installed packages globally by accident, consider removing them and re-installing inside a virtual environment to avoid conflicts.
- The frontend static files are served from `src/static/`. If you need to edit the UI, open `src/static/index.html` and the linked JS/CSS files.

If you want me to also update the repository root `README.md` with matching instructions (so steps are consistent for people who open the project root), tell me and I will update that too.
