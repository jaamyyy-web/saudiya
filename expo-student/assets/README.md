# App Assets — Required Before Production Build

You MUST add the following image files to this `assets/` directory before building:

## Required Files

### 1. `icon.png`
- **Size:** 1024 × 1024 px
- **Format:** PNG (no transparency for iOS)
- **Purpose:** App icon on home screen and stores
- Used in both Google Play Store and Apple App Store listings

### 2. `splash.png`
- **Size:** 1284 × 2778 px (recommended)
- **Format:** PNG
- **Purpose:** Splash/loading screen shown on app launch
- Background color is set to `#064E3B` (dark green) in app.json

### 3. `adaptive-icon.png`
- **Size:** 1024 × 1024 px
- **Format:** PNG with transparency
- **Purpose:** Android adaptive icon foreground layer
- Background color is set to `#064E3B` in app.json

## How to Add
1. Design your icons (or use a service like https://icon.kitchen)
2. Save the files with the exact names listed above
3. Place them in this `assets/` folder
4. Run `npx expo start` to verify they load correctly

## Store Listing Screenshots (also needed)
When submitting to stores, you'll also need:
- 3-5 screenshots for each device size (phone, tablet)
- A feature graphic (1024 × 500 px) for Google Play
- An optional preview video
