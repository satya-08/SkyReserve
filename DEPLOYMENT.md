# Deploying SkyReserve Web Application (Single Platform)

This guide summarizes how to deploy the entire SkyReserve progressive web application (frontend and backend) to a single **Render** Web Service instance.

## Deployment Steps (Render)

1. **Database:** Ensure you have provisioned an **Atlas MongoDB** database cluster and copied its connection URI.
2. **Platform:** Sign up or log into [Render.com](https://render.com).
3. **Repository:** Connect your GitHub repository and select the **Web Service** deployment.
4. **Configuration Details:**
   - **Name:** `SkyReserve` (or your choice)
   - **Root Directory:** *(leave blank / empty)*
   - **Build Command:** `npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend`
   - **Start Command:** `npm start --prefix backend`
5. **Environment Variables:**
   - `PORT`: `5000` (Render will override this automatically, but standard is `5000`)
   - `NODE_ENV`: `production` (This triggers the backend to serve the compiled frontend!)
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0...` (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: Generate a secure random string (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
6. **Deploy:** Click "Create Web Service" and wait for the build to complete.

### How it Works
When deployed to production (triggered by `NODE_ENV=production`), the Node.js backend automatically assumes the responsibility of serving your React/Vite PWA via the static `frontend/dist/` directory.

- Your app will be accessible at the generated Render URL (e.g., `https://skyreserve-xxxx.onrender.com`).
- The API endpoints map natively to `/api`.
- The frontend will automatically route any browser page refreshes directly to the React application.
