# File Management System

A full-stack File Management System application created to facilitate file management tasks such as uploading, downloading, renaming, and deletion. This application supports CRUD (Create, Read, Update, Delete) operations, powered by a robust backend and a user-friendly frontend.

**Date Submitted:** 15th October 2024

## Technologies Used

**Front-End:**
- Vue.js
- Axios
- Bootstrap

**Back-End:**
- Node.js
- Express.js
- Multer (File upload)

**Database:**
- MySQL

## Features
- **File Upload**: Allows users to upload files to the server.
- **File Renaming**: Users can rename files on the server.
- **File Deletion**: Allows users to delete files.
- **CRUD Operations**: Create, read, update, and delete files seamlessly.

## Installation

To run the project locally, follow these steps:

### Prerequisites
Before starting, make sure you have the following installed on your machine:
- **Node.js** (Version 14 or above)
- **MySQL** (Version 8 or above)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/File-Management-System.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd File-Management-System
   ```

3. **Install dependencies**:
   ```bash
   npm run install-all
   ```

4. **Update the MySQL config** in `server/app/config/db.config.js` with your database details.

### Start the Project

1. **Start the server**:
   ```bash
   npm start
   ```

2. The client will run on `http://localhost:5173`, while the server will run on `http://localhost:8080` by default.

---

This `README` provides a brief overview of your project, its technology stack, installation instructions, and setup steps. You can modify the paths or repository details according to your actual project.
