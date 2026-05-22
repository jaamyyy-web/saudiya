# SAD Web Admin Panel

This is a separate desktop/PC admin panel for the SAD education app.

It is intentionally isolated from the Android app so it does not affect the current mobile environment.

## Folder

```text
web-admin/
```

## Local run

```bash
cd web-admin
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Production build

```bash
cd web-admin
npm install
npm run build
npm run preview
```

## Deploy to Vercel as a separate URL

Create a new Vercel project from the same GitHub repo and use these settings:

```text
Root Directory: web-admin
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

This will give a separate admin panel URL without affecting the Android app.

## Current status

This is UI-first admin panel v1. It includes:

- Dashboard
- Learning Pack Manager
- AI Quiz Review Queue
- Students screen
- Subscriptions screen
- Settings screen

## Next production steps

1. Add real admin authentication.
2. Connect Firebase/Supabase environment variables.
3. Replace demo data with live API calls.
4. Add role-based access control.
5. Add upload and AI generation backend endpoints.
6. Add review/approve/publish workflows connected to the mobile app database.
