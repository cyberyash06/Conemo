# 🔮 Conemo - Anonymous Mood Chat

Conemo is a premium, real-time, anonymous chat application that pairs users based on their current mood. It provides a secure, lightweight platform for instant connection without the hurdle of creating an account or managing profiles. 

Features a beautiful, modern **Glassmorphism** UI with synchronized real-time animations.

---

## ✨ Features
- **Mood-Based Matchmaking**: Instantly connect with others feeling the same way you do via a smart queue system.
- **Anonymous Guest Authentication**: JWT-based secure sessions without requiring passwords.
- **Real-Time Messaging**: Built on Socket.io for instantaneous sub-second message delivery.
- **Dynamic UX**: Live typing indicators, automatic partner disconnection handling, and smooth page transitions.
- **Premium Glassmorphism UI**: High-fidelity blurs, glowing orbs, and dark-mode aesthetic.

---

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB (Mongoose)
- **Testing**: Playwright End-to-End Testing

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your environment variables:** 
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://username:password@your-atlas-cluster.mongodb.net
   JWT_SECRET=your_super_secure_random_string_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   PORT=3000
   ```
   > ⚠️ **Important**: Ensure your local IP address is whitelisted (`0.0.0.0/0`) in your MongoDB Atlas Network Access Firewall!

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

---

## 🚀 Production Deployment Guide (Free Tier & WebSocket Safe)

### The Serverless Problem
Conemo uses **WebSockets (Socket.io)** to ensure messages send instantly and users can see when others are typing. WebSockets require a persistent, "always-on" connection between the browser and the server.

Because of this, **you cannot deploy Conemo to Vercel, Netlify, or standard Serverless platforms.** Those platforms are designed to kill connections after 10-60 seconds, which will violently disconnect your users from their chat rooms.

### The Solution: Containerized Web Services
To host this for **free** without your chats disconnecting, we will use **Render.com**. Render provides real Linux servers (Web Services) that natively support Docker and long-lived WebSocket connections.

#### Step-by-Step Free Deployment via Render

1. **Create an account:** Go to [Render.com](https://render.com/) and sign up using your GitHub account.
2. **Push your code:** Ensure all your Conemo code (including the `Dockerfile` and `render.yaml`) is pushed to a fresh GitHub repository.
3. **Connect to Render:** 
   - On the Render dashboard, click **New +** and select **Blueprint**.
   - Connect your GitHub account and select your Conemo repository.
4. **Deploy:** 
   - Render will automatically read the `render.yaml` file included in this project.
   - It will automatically set up a **Node.js Web Service** using the `Dockerfile` for your frontend/backend server.
   - It will also automatically provision a **Free MongoDB Database** for you and link them together!
   - Click **Apply**.
5. **Environment Variables:**
   - Go to your newly created Web Service on the Render dashboard.
   - Click **Environment** and add your `JWT_SECRET`. (Render handles the `MONGODB_URI` string automatically via the Blueprint).

#### ⚠️ Expected Free Tier Behaviors
Render's free tier is excellent for small, personal use, but has one caveat to keep in mind:
- **Spin-Down:** If *nobody* visits your website for 15 minutes, the server will "go to sleep". 
- **Wake-Up Delay:** The next person who visits the site after it falls asleep will have to wait about 45-60 seconds for the server to wake up (the page will load slowly).
- **While Active:** Once awake, the server acts like a normal, high-speed server. **Your active chat rooms will NEVER be forcefully disconnected** as long as people are actively chatting!
