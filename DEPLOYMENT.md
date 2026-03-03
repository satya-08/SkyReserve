# Deploying SkyReserve Web Application

This guide summarizes how to deploy the SkyReserve platform as a robust Progressive Web App (PWA) onto Render (Backend) and Vercel (Frontend).

## 1. Backend Deployment (Render)

1. Provision an **Atlas MongoDB** database cluster and copy its connection URI.
2. Sign up on [Render.com](https://render.com).
3. Connect your repository and select the **Web Service** deployment.
4. Set the Root Directory to `backend/`.
5. Set Build Command to `npm install`.
6. Set Start Command to `node server.js`.
7. Configure the following Environment Variables:
   - `PORT`: (Render will override this, but standard is `5000`)
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0...`
   - `JWT_SECRET`: Generate a secure random string (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
8. Deploy the service and retrieve the public API URL (e.g., `https://skyreserve-api.onrender.com`).

## 2. Frontend Deployment (Vercel)

Vercel is optimal for the Vite/React frontend due to exceptional edge caching and automatic configurations.

1. Create a `Vercel` account and import your repository.
2. Set the Root Directory to `frontend/`.
3. Vercel will automatically detect `Vite` and run `npm run build`.
4. Ensure the `.env` variables or Vercel Environment UI sets the production API endpoint:
   - `VITE_API_URL`: Replace local `http://localhost:5000` with your new Render URL (`https://skyreserve-api.onrender.com`).
5. Vercel handles all `HTTPS` automatically. Since `vite-plugin-pwa` is installed, the Vercel build will successfully generate the `sw.js` and `workbox` bundle hashes inside your `dist/` directory.

### PWA Configuration

- Since the Frontend enforces `HTTPS` via Vercel, the PWA `Service Worker` will be fully secure and functional.
- Static assets like Google Fonts are cached dynamically via the generated Workbox Runtime Caching strategies to ensure fast repeats and offline handling.
- Manifest definitions (`logo.svg`, `theme-color: #2563eb`) are injected into the head.

## Verification

After deploying, navigate to the frontend URL on an Android or iOS device:
- Click the "Install App" button inside the Navbar, or the browser's native "Add to Home Screen" pop-up.
- The web app will install silently on the device exactly like a native app.
- Open the resulting mobile app; you will see it run in Standalone mode with no browser URL Chrome element!
