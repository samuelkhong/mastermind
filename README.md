# Mastermind Deployment Guide

Welcome to the Mastermind deployment guide! This guide will walk you through the steps to deploy the Mastermind game locally using Node.js.

live link here: https://mastermind-wpvf.onrender.com/

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v14.x or higher)
- npm (Node Package Manager)

## Installation

To get started, clone the Mastermind repository from GitHub:

```bash
git clone https://github.com/samuelkhong/mastermind.git
```

Once cloned, navigate to the project directory:

```bash
cd mastermind
```

Next, install the dependencies using npm:

```bash
npm install
```

## Configuration

Mastermind uses environment variables for configuration. Create a `.env` file in the config directory of the project and add the following variables:

```makefile
PORT=3000
DB_STRING=your_mongodb_uri
SESSION_SECRET=your_session_secret
```

Replace `your_mongodb_uri` with your MongoDB connection string and `your_session_secret` with a random string for session management.

## Starting the Server

To start the server, run the following command:

```bash
npm start
```

This will start the server on port 3000 by default. You can access the application by navigating to `http://localhost:3000` in your web browser.

## Usage

Once the server is running, you can access the Mastermind game in your web browser. Follow the on-screen instructions to play the game.

## Development

If you want to make changes to the code and test locally, you can use nodemon for automatic server restarts. Start the server in development mode using:

```bash
npm run dev
```

