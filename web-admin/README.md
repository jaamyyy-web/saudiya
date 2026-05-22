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

## Firebase Hosting deployment

This admin panel is prepared for Firebase Hosting.

Firebase Hosting config is at the repo root:

```text
firebase.json
```

It serves:

```text
web-admin/dist
```

### Step 1: Create Firebase Web App

Use the same Firebase project as the Android app:

```text
Firebase Console → Project Settings → Your apps → Add app → Web
```

Copy the Firebase web config values.

### Step 2: Create production env file

Copy:

```bash
cd web-admin
cp .env.example .env.production
```

Then edit `web-admin/.env.production`:

```text
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

`VITE_ADMIN_EMAILS` is the fastest safe way to allow specific admin emails.

### Step 3: Enable login providers

In Firebase Console:

```text
Authentication → Sign-in method
```

Enable:

```text
Email/Password
Google
```

### Step 4: Build and deploy

From repo root:

```bash
cd web-admin
npm install
npm run build
cd ..
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only hosting
```

Firebase will give URLs like:

```text
https://your-project-id.web.app
https://your-project-id.firebaseapp.com
```

### Step 5: Add authorised domain

In Firebase Console:

```text
Authentication → Settings → Authorised domains
```

Add your Firebase Hosting domain if it is not already listed:

```text
your-project-id.web.app
your-project-id.firebaseapp.com
```

### Optional Firestore admin role check

Instead of only using `VITE_ADMIN_EMAILS`, you can add a Firestore document:

```text
Collection: admin_users
Document ID: Firebase user UID
Fields:
  active: true
  role: admin
```

Allowed roles:

```text
admin
super_admin
editor
```

## Current status

This is admin panel v1. It includes:

- Firebase-protected login screen
- Dashboard
- Learning Pack Manager
- AI Quiz Review Queue
- Students screen
- Subscriptions screen
- Settings screen

## Next production steps

1. Connect live Firestore collections from the Android app.
2. Replace demo data with live API calls.
3. Add upload and AI generation backend endpoints.
4. Add review/approve/publish workflows connected to the mobile app database.
5. Add stricter Firestore security rules for admin-only access.
