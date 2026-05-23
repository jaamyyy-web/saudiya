# SaudiEdu / SAd

SaudiEdu is an Arabic RTL student learning app with a Firebase-powered admin panel, AI content generation pipeline, and Expo student mobile app.

## Current stack

- Web admin: React + Vite
- Student app: Expo SDK 54 / React Native
- Backend: Firebase Firestore, Storage, Auth, Hosting, Functions
- AI generation: Gemini through Firebase Functions

## Project structure

```bash
web-admin/        # Admin panel
expo-student/     # Expo student mobile app
functions/        # Firebase Functions AI generation backend
firestore.rules   # Firestore security rules
storage.rules     # Firebase Storage rules
firestore.indexes.json
firebase.json
TESTING_CHECKLIST.md
```

## Firebase project

```bash
firebase use saudiedu-3fe68
```

## Deploy Firebase

Deploy everything:

```bash
firebase deploy --only firestore,storage,functions,hosting
```

Deploy only rules/indexes:

```bash
firebase deploy --only firestore,storage
```

Deploy only backend functions:

```bash
firebase deploy --only functions
```

Deploy only admin hosting:

```bash
cd web-admin
npm install
npm run build
cd ..
firebase deploy --only hosting
```

## Run web admin locally

```bash
cd web-admin
npm install
npm run dev
```

Admin login is handled through Firebase Auth.

## Run Expo student app

```bash
cd expo-student
npm install
npx expo start --tunnel --clear
```

## Demo mode test without Gemini

The admin panel includes a **Create Demo Learning Pack** button. Use this before setting the Gemini key.

It creates:

- one published learning pack
- one published summary
- published questions

Then open the Expo student app and confirm the pack appears live.

## AI generation flow

1. Admin uploads PDF/TXT/CSV.
2. Admin approves upload.
3. Admin clicks Queue AI.
4. `generation_jobs` document is created.
5. Firebase Function reads Storage file.
6. PDF/TXT/CSV text is extracted.
7. Gemini creates summary and questions.
8. Draft learning pack, summary, and questions are saved.
9. Admin clicks Show.
10. Student app receives live published content.

## Gemini key

Gemini key can be added later before production AI testing.

Legacy config method:

```bash
firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY"
firebase deploy --only functions
```

Environment variable method:

```bash
GEMINI_API_KEY="YOUR_GEMINI_API_KEY" firebase deploy --only functions
```

## Testing

Follow:

```bash
TESTING_CHECKLIST.md
```

Minimum MVP success condition:

> Admin creates or publishes a learning pack, and the Expo student app shows it live with summary and questions.
