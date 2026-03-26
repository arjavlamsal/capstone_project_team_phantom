# Flask Backend

This is the backend API for your capstone project.

## Setup

**IMPORTANT: Use `uv` to manage the backend virtual environment and dependencies.**

### Step 1: Create Virtual Environment

```bash
uv sync
```

### Step 2: Run the Server

```bash
uv run app.py
```

The backend will be available at `http://localhost:5000`

## Default Test User

- Username: `admin`
- Password: `admin123`

## Database

SQLite database file: `database.db`

The database is automatically created when you first run `app.py`.

## Adding New Features

1. Add new database tables in the `init_db()` function
2. Create new API endpoints using `@app.route()`
3. Use `get_db()` to access the database
4. Return JSON responses using `jsonify()`

## Example Endpoint

```python
@app.route('/api/example', methods=['GET'])
def example():
    return jsonify({'message': 'Hello!'})
```

## Important Notes

- Sync dependencies any time with: `uv sync`
- Add a package to project metadata with: `uv add package-name`
- Regenerate lockfile after dependency changes with: `uv lock`
- Run commands in project environment with: `uv run <command>`
- Don't commit the `.venv` folder to git (add `.venv/` to `.gitignore`)
