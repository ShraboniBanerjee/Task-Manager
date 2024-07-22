# Task Manager App

A Task Manager application built using Node.js, Express, React, Firebase Firestore for the database, and Firebase for deployment.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)

## Features

- User Authentication with Firebase (Google Sign-Up/Login)
- Create, Read, Update, and Delete (CRUD) tasks
- Task categorization (To-Do, In Progress, Done)
- Drag and Drop functionality for task management
- Search and Sort tasks
- Responsive Design

## Demo

Check out the live demo of the website hosted in Firebase [here](https://task-manager-app-fd207.web.app/sign-in).

Please download the Video version of the Output: ![Download Here](output.mp4)

## Installation

### Prerequisites

- Node.js and npm installed on your machine
- Firebase CLI installed globally

### Steps

1. **Download the code as a ZIP file:**

   Download the repository as a ZIP file from GitHub and extract it to your desired location.

2. **Extract the ZIP file:**

   Extract the contents of the ZIP file.

   ```bash
   unzip task-manager-app.zip
   cd task-manager-app
   ```

3. **Install dependencies:**

   Navigate to the project directory and install the necessary dependencies using npm.

   ```bash
   cd task-manager-app
   npm install
   ```

4. **Set up Firebase:**

   Ensure you have Firebase CLI installed. If not, install it globally using npm.

   ```bash
   npm install -g firebase-tools
   ```

   Log in to Firebase:

   ```bash
   firebase login
   ```

   Initialize Firebase in your project:

   ```bash
   firebase init
   ```

   Follow the prompts to configure Firebase for your project. Make sure to select Firestore and Hosting.

5. **Configure Firebase:**

   In your `src/firebase.js` file, add your Firebase project configuration details.

6. **Run the application:**

   Start the development server.

   ```bash
   npm start
   ```

   The app should now be running on `http://localhost:3000`.

## Usage

- **Sign Up/Login:**

  Use Google Sign-Up/Login to authenticate yourself.

- **Create Tasks:**

  Add new tasks to your task board.

- **Manage Tasks:**

  Drag and drop tasks between columns.

- **Search and Sort:**

  Use the search bar to find specific tasks and the sort functionality to organize them.
