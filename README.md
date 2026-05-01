# Team Task Manager – Full Stack Web Application

## Overview

This project is a full-stack Team Task Management web application designed to help teams collaborate, assign tasks, and track progress efficiently. It allows multiple users to work together within projects, manage responsibilities, and stay organized.

The application is inspired by tools like Trello and Asana but focuses on simplicity and core collaboration features.

---

## Features

### Authentication

* User signup with name, email, and password
* Secure login using JWT-based authentication
* Protected routes for authorized access

### Project Management

* Create new projects
* Project creator becomes Admin
* Admin can add/remove members
* Users can view joined projects

### Task Management

* Create tasks with title, description, due date, and priority
* Assign tasks to users
* Update task status (To Do, In Progress, Done)

### Dashboard

* Total tasks overview
* Tasks grouped by status
* Tasks per user
* Overdue task tracking

### Role-Based Access

| Role   | Permissions                                             |
| ------ | ------------------------------------------------------- |
| Admin  | Manage members, create/update/delete tasks, full access |
| Member | View projects, update assigned tasks only               |

---

## Tech Stack

| Layer    | Technology       |
| -------- | ---------------- |
| Frontend | React            |
| Backend  | Node.js, Express |
| Database | MySQL            |
| Auth     | JWT              |

---

## Project Structure

```
Team Task Manager/
├── client/
│   ├── src/
│   │   ├── components/       # Navbar.jsx
│   │   ├── pages/            # Login, Signup, Dashboard, ProjectDetails
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── config/               # db.js
│   ├── controllers/          # auth, project, task controllers
│   ├── middleware/           # auth.js
│   ├── models/               # index.js
│   ├── routes/               # auth, tasks, projects routes
│   ├── index.js
│   └── package.json
│
├── package.json              # Root manager
└── README.md
```

---

## API Overview

| Module    | Endpoints                      |
| --------- | ------------------------------ |
| Auth      | Signup, Login                  |
| Projects  | Create, Join, Manage Members   |
| Tasks     | Create, Assign, Update, Delete |
| Dashboard | Stats & Insights               |

---


## Deployment (Railway)

* Connect GitHub repository to Railway
* Add environment variables
* Deploy backend and frontend
* Ensure API URLs are configured correctly

---

## Submission

| Item        | Link |
| ----------- | ---- |
| Live App    |  https://radiant-tenderness-production-f64f.up.railway.app/    |
| GitHub Repo |https://github.com/govindheda070504/Team_Task_Manager.git   |
| Demo Video  | https://drive.google.com/drive/folders/18V0eG9Kp7Hkho5noXwhuo3aHWouJgzex?usp=sharing     |

---

## Notes

This project demonstrates full-stack development skills including authentication, REST API design, database relationships, and deployment.

The structure is kept simple and modular so it can be easily extended with additional features.
