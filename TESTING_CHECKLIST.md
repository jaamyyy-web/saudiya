# SaudiEdu / SAd End-to-End Testing Checklist

Use this checklist when running the project after deployment.

## 1. Pull latest code

```bash
git pull
```

## 2. Deploy Firebase infrastructure

```bash
firebase use saudiedu-3fe68
firebase deploy --only firestore,storage,functions,hosting
```

If Gemini API key is not set yet, the Functions fallback/demo content may be used.

## 3. Test admin demo pack without Gemini

1. Open the admin panel.
2. Login with the admin account.
3. Go to Dashboard or Learning Packs.
4. Click **Create Demo Learning Pack**.
5. Confirm a success message appears.
6. Go to **Live Learning Packs**.
7. Confirm the demo pack is visible and published.

Expected Firestore documents:

- `learning_packs` has one published demo pack.
- `summaries` has a published summary linked by `packId`.
- `questions` has published questions linked by `packId`.

## 4. Test Expo student app live data

```bash
cd expo-student
npm install
npx expo start --tunnel --clear
```

Then open on mobile.

Expected result:

- Splash screen opens.
- Login screen opens.
- After demo login, home opens.
- Published learning pack appears.
- Pack detail opens.
- Summary loads.
- Questions load.
- Completion screen appears.

## 5. Test upload and AI queue

1. In admin, upload a small PDF/TXT/CSV.
2. Confirm it appears in Uploaded Sources.
3. Click Approve.
4. Click Queue AI.
5. Confirm `generation_jobs` document is created.
6. Confirm job status moves to `processing` then `completed` or `failed`.

Expected Firestore documents after successful generation:

- `generation_jobs` status = completed.
- `learning_packs` draft pack created.
- `summaries` draft summary created.
- `questions` draft questions created.

## 6. Publish generated pack

1. Go to Live Learning Packs.
2. Click Show on the generated draft pack.
3. Confirm pack status is published.
4. Confirm linked summaries/questions status are published.
5. Reload Expo app.
6. Confirm generated pack appears live.

## 7. Common errors and fixes

### Firestore index error

Run:

```bash
firebase deploy --only firestore:indexes
```

### Storage permission error

Run:

```bash
firebase deploy --only storage
```

### Function not triggering

Check:

- `generation_jobs` document is created.
- Firebase Functions were deployed.
- Project is set to `saudiedu-3fe68`.

### Gemini not generating

Check:

- Gemini key is set.
- Function logs show no API key error.
- If key is missing, fallback/demo generation should still prevent total failure.

## 8. Minimum success condition

The MVP is working when:

Admin creates or publishes a learning pack, and the Expo student app shows it live with summary and questions.
