# Next.js Frontend

This is the frontend for your capstone project.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── layout.jsx      # Main layout (wraps all pages)
├── page.jsx        # Home page (/)
└── [your-pages]/   # Add your pages here
```

## Adding New Pages

Create a new folder in `app/` with a `page.jsx` file:

```
app/
└── login/
    └── page.jsx    # This creates the /login route
```

Example page:
```javascript
export default function LoginPage() {
  return <h1>Login Page</h1>;
}
```

## Making API Calls

Example of calling your Flask backend:

```javascript
'use client';

import { useState } from 'react';

export default function ExamplePage() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await fetch('http://localhost:5000/api/test');
    const json = await response.json();
    setData(json);
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

## Important Notes

- Use `'use client'` at the top of files that use hooks (useState, useEffect, etc.)
- Backend API is at `http://localhost:5000`
- All routes are file-based (folder structure = URL structure)
