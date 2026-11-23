# CropGuard — Frontend Demo

A responsive React + Vite frontend for an **AI-Based Crop Disease and Pest Detection & Pesticide Assistance System**.

## Pages
1. Login / Sign up
2. Farmer Dashboard
3. Disease Detection (image upload + preview)
4. Detection Reports (sample disease result, pesticide-assistance information, prevention tips)

## Run locally
Install Node.js (18+), then in this folder run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## Demo behaviour
- Login and sign up are frontend-only. Any valid email and password (minimum 4 characters) will enter the dashboard.
- Navigation between all four pages works.
- Image upload, image preview, crop selection, notes and sample assessment work in the browser.
- Reports are saved in browser `localStorage` and remain after refresh in the same browser.

## Important limitations
This is **frontend only**. It does not include a backend, real user authentication, a trained AI model, disease image classification, a live pesticide database, or real pesticide prescriptions. The sample assessment is illustrative UI content. Do not use it to make real crop-treatment decisions.

## Connect a backend later
The UI is structured so the sample `analyze` function in `src/App.jsx` can later be replaced with an API call to an image-detection service. Authentication and report persistence can also be connected to backend endpoints.
