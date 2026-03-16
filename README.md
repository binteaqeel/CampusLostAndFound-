Campus Lost & Found
A full-stack web application designed for university students to report, track, and claim lost or found items on campus. Built with a modern tech stack for a smooth, real-time experience.

Features
Report Lost Items: Students can post details about items they've lost, including descriptions and locations.
Report Found Items: Users can list items they've found to help return them to their owners.
Real-time Dashboard: View a live feed of all lost and found items.
Item Status Tracking: Mark items as "Claimed" once they are returned.
Responsive Design: Fully optimized for both desktop and mobile devices.
Secure Backend: Powered by Express and MongoDB for reliable data storage.

Tech Stack
Frontend: React 19, Vite, Tailwind CSS
Backend: Node.js, Express
Database: MongoDB (via Mongoose)
Animations: Motion (Framer Motion)
Icons: Lucide React

Local Setup Instructions
Follow these steps to get the project running on your local machine.
1. Prerequisites
Node.js (v18 or higher)
MongoDB Atlas account (or a local MongoDB instance)

Clone the Repository
code
Bash
git clone <your-repository-url>
cd campus-lost-found

Install Dependencies
code
Bash
npm install

Environment Configuration
The project requires a .env file to connect to the database.
Create a file named .env in the root directory.
Open .env.example to see the required variables.
Add your MongoDB connection string to the .env file:
code
Env
MONGODB_URI="your_mongodb_connection_string_here"
Note: Never share your .env file or push it to GitHub.

Run the Application
code
Bash
npm run dev
The app will be available at http://localhost:3000.

Deployment
This project is deployment-ready for platforms like Render or Vercel.
Deploying to Render (Recommended)
Connect your GitHub repository to Render.
Create a new Web Service.
Use the following settings:
Build Command: npm install && npm run build
Start Command: npm start
In the Environment tab, add your MONGODB_URI.

Project Structure
/src: React frontend components and logic.
server.ts: Express server and API routes.
metadata.json: Project metadata and permissions.
.env.example: Template for environment variables.

License
This project is for educational purposes. Feel free to modify and use it for your own campus!
