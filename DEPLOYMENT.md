# Deployment Guide: Interview AI 🚀

This guide will walk you through the steps to get your application live.

## 1. Prepare your Database (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  Create a cluster and copy your **Connection String**.
3.  Add `0.0.0.0/0` to your IP whitelist in "Network Access".

## 2. Deploy the Backend (Render)
1.  Push your code to **GitHub**.
2.  Create a new **Web Service** on [Render](https://render.com/).
3.  Point it to your repo and set the **Root Directory** to `Backend`.
4.  Add these Environment Variables in Render:
    - `MONGO_URI`: `your_atlas_connection_string`
    - `JWT_SECRET`: `anything_random`
    - `GOOGLE_GENAI_API_KEY`: `your_key`
    - `FRONTEND_URL`: `https://your-frontend-app.vercel.app` (You'll get this in the next step)

## 3. Deploy the Frontend (Vercel)
1.  Create a new project on [Vercel](https://vercel.com/new).
2.  Connect your repo and set the **Root Directory** to `Frontend`.
3.  Add this Environment Variable in Vercel:
    - `VITE_API_BASE_URL`: `https://your-backend-app.onrender.com` (The URL Render gave you)

---

**Note:** I have already refactored your code to use these environment variables automatically!
