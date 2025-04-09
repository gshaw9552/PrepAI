# PrepAI Backend

PrepAI Backend provides the RESTful API for the PrepAI interview platform. Built with Node.js, Express, and TypeScript, it integrates AI-driven question generation and feedback (via the Gemini API) and uses MongoDB for data persistence.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

## Overview

This backend service handles user authentication, interview question generation, answer evaluation, session storage, and analytics for the PrepAI platform. The API is built using Express with TypeScript and connects to MongoDB for storing user data, interview sessions, and saved questions.

## Tech Stack

- **Node.js & Express**: Server and API endpoints.
- **TypeScript**: Type safety for improved code quality.
- **MongoDB**: Data storage using Mongoose ODM.
- **Gemini API**: For AI-powered question generation and answer evaluation.
- **Render**: Deployment platform.

## Features

- User authentication (Login and Register)
- Interview question generation and evaluation through AI (Gemini API)
- Interview session tracking with overall scoring
- Saving questions for later review
- Analytics endpoints to monitor interview progress

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/PrepAI.git
   cd PrepAI/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Development

Ensure you have a running MongoDB instance (local or remote). Then compile and run the backend:

```bash
npm run build
npm start
```

For development mode (build and run):

```bash
npm run dev
```

## Deployment

This backend is deployed on Render as serverless functions.

## Environment Variables

Create a `.env` file in the `/backend` folder or set the following in Vercel's dashboard:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```
