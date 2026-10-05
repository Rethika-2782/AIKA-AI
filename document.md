# JERUSALEM COLLEGE OF ENGINEERING
(An Autonomous Institution)
(Approved by AICTE, Affiliated to Anna University, Chennai)
ACCREDITED by NBA and NAAC with 'A' Grade
Velachery Main Road, Narayanapuram, Pallikkaranai, Chennai – 600100

**MERN STACK DEVELOPMENT LABORATORY**
**JGE2542**
[INDUSTRY SUPPORTED COURSE]

**PROJECT REPORT**
**ACADEMIC YEAR 2026–27**

“AIKA AI - AI-Powered Legal Access & Assistance Platform”

Submitted by
**RETHIKA S**
[REGISTER NUMBER]

III YEAR / V SEMESTER
REGULATION 2023

DEPARTMENT OF < >
<PROGRAMME>

---

## BONAFIDE CERTIFICATE

This is to certify that Ms. **RETHIKA S** (Register number: [REGISTER NUMBER]), is a bonafide student of Jerusalem College of Engineering, Chennai. The student has successfully completed the project titled “AIKA AI - AI-Powered Legal Access & Assistance Platform” as part of JGE2542 – MERN Stack Development Laboratory during the academic year 2026–2027. The project work has been completed successfully as per the requirements of the course.

<Name of Faculty Coordinator>       <Head of the Department>

<Designation>
Dept. of __________________
Jerusalem college of Engineering
Pallikaranai,
Chennai – 600100. HEAD OF THE DEPARTMENT

Professor & Head
Dept. of —-------------------------
Jerusalem college of Engineering
Pallikaranai,
Chennai – 600 100.

EXTERNAL EXAMINER

---

## ACKNOWLEDGEMENT

We express our sincere gratitude to the Management and Principal of Jerusalem College of Engineering, Chennai, for providing the facilities and academic support required to complete this project successfully.

We extend our sincere thanks to the Head of the Department and the faculty members of our respective programme for their encouragement, suggestions, and support throughout the project.

We also thank the Course Coordinator and faculty members associated with JGE2542 – MERN Stack Development Laboratory for their valuable guidance and support during the development and documentation of the project.

Finally, we thank our parents, friends, and everyone who supported us directly or indirectly in completing this project successfully.

---

## ABSTRACT

Aika AI is a full-stack MERN application that provides global AI-powered legal access and assistance. It is designed to help users understand complex legal situations, generate customized legal documents, simplify difficult legal clauses, and provide an actionable path to resolve their issues. The system features a responsive, dynamic UI built with React and Tailwind CSS, authenticated via JWT on an Express.js backend, and uses MongoDB for reliable case and user management. Integration with the Google Gemini API ensures accurate and context-aware plain-language explanations, ensuring that AI-generated assistance remains strictly informative and distinct from legal advice.

---

## TABLE OF CONTENTS

| S.No. | Chapter / Content | Page No. |
|---|---|---|
| 1 | Introduction | 1 |
| 1.1 | Project Overview | 2 |
| 2 | Requirements Analysis | 3 |
| 2.1 | Hardware Requirements | 3 |
| 2.2 | Software Requirements | 4 |
| 2.3 | Functional Requirements | 4 |
| 2.4 | Non-Functional Requirements | 5 |
| 3 | System Design | 6 |
| 3.1 | System Architecture | 6 |
| 3.2 | Database Design | 7 |
| 4 | Technology Stack | 8 |
| 4.1 | MongoDB | 8 |
| 4.2 | Express.js | 8 |
| 4.3 | React.js | 9 |
| 4.4 | Node.js | 9 |
| 4.5 | Other Tools / Libraries | 10 |
| 5 | System Implementation | 11 |
| 5.1 | Module 1: User Authentication & Security | 11 |
| 5.2 | Module 2: AI Interaction & Simplifier | 12 |
| 5.3 | Module 3: Case & Evidence Management | 13 |
| 5.4 | Module 4: Document Generation | 14 |
| 5.5 | API / Backend Implementation - code | 15 |
| 5.6 | Frontend Implementation - code | 16 |
| 6 | Results and Screenshots | 17 |
| 7 | Conclusion and Future Enhancement | 18 |
| 8 | References | 19 |

---

*(The content for each chapter goes here. You can expand it as required for your submission.)*

# 4. TECHNOLOGY STACK

ĀIKĀ AI is developed using the MERN stack along with supporting libraries and tools for authentication, user interface development, database management, and AI-based legal assistance. The system uses an inbuilt rule-based AI engine and does not depend on external AI APIs.

## 4.1 MongoDB

MongoDB is used as the database for storing application data. It stores user accounts, legal cases, evidence items, documents, consultations, and AI interactions. Mongoose is used to define schemas and communicate with MongoDB.

**Example Code (Mongoose Schema):**
```javascript
const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', caseSchema);
```

## 4.2 Express.js

Express.js is used to build the backend REST API. It handles routes, controllers, authentication, case management, evidence management, document operations, AI operations, and dashboard services.

**Example Code (Express Route & Controller):**
```javascript
const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// Get all cases for a user
router.get('/cases', async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user.id });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
```

## 4.3 React.js

React.js is used to develop the frontend of the application. It provides the user interface for login, dashboard, case management, evidence management, AI tools, document generation, and profile management. Vite, Tailwind CSS, Framer Motion, React Router, and Axios support the frontend development.

**Example Code (React Component):**
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaseList = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      const response = await axios.get('/api/cases');
      setCases(response.data);
    };
    fetchCases();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">My Cases</h2>
      <ul>
        {cases.map(c => (
          <li key={c._id} className="border-b py-2">{c.title} - {c.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default CaseList;
```

## 4.4 Node.js

Node.js provides the runtime environment for the backend application. It runs the Express.js server and handles API requests, authentication, database operations, and communication with the AIKA Engine.

**Example Code (Node.js Server Setup):**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 4.5 Other Tools / Libraries & AIKA Engine

The project uses several supporting technologies:

* **Mongoose** – MongoDB object modeling.
* **JWT** – Token-based authentication.
* **bcrypt** – Password hashing.
* **Axios** – Frontend API communication.
* **Tailwind CSS** – User interface styling.
* **Framer Motion** – UI animations.
* **React Router** – Frontend routing.
* **Helmet** – Backend security headers.
* **CORS** – Cross-origin request handling.
* **dotenv** – Environment variable management.
* **Vite** – Frontend development and build tool.

### AIKA Engine Implementation

The **AIKA Engine** is an inbuilt deterministic rule-based legal assistance engine used to process legal queries based on predefined rules, minimizing reliance on external APIs and providing immediate, context-aware responses based on system rules.

**Example Code (AIKA Rule-Based Engine):**
```javascript
class AIKAEngine {
  constructor() {
    this.rules = [
      {
        keyword: 'divorce',
        response: 'For divorce proceedings, you will need a marriage certificate, ID proofs, and a joint petition if it is mutually agreed. Please consult a family court lawyer.'
      },
      {
        keyword: 'property dispute',
        response: 'Property disputes require clear documentation of ownership (title deeds). It is advisable to gather all related property tax receipts before proceeding.'
      }
    ];
  }

  processQuery(query) {
    const lowerQuery = query.toLowerCase();
    for (let rule of this.rules) {
      if (lowerQuery.includes(rule.keyword)) {
        return rule.response;
      }
    }
    return 'I am unable to provide specific legal information for this query. Please consult a qualified legal professional.';
  }
}

// Usage
const aika = new AIKAEngine();
console.log(aika.processQuery('What should I do for a property dispute?'));
```

# 5. SYSTEM IMPLEMENTATION

This chapter discusses the detailed implementation of the AIKA AI platform, divided into four core modules, followed by specific examples of API backend and frontend code integration.

## 5.1 Module 1: User Authentication & Security

The authentication module is responsible for securely managing user registrations and logins. It utilizes JSON Web Tokens (JWT) for maintaining stateless sessions and `bcrypt` for encrypting passwords before storing them in the MongoDB database. 
- **Registration**: Captures user details, hashes the password, and creates a user record.
- **Login**: Verifies credentials and issues a JWT token.
- **Authorization**: Middleware intercepts incoming API requests to validate the JWT token, ensuring only authenticated users can access protected routes.

## 5.2 Module 2: AI Interaction & Simplifier

This module integrates the AIKA Engine to process natural language legal queries.
- **Query Processing**: Takes user input and analyzes it using the rule-based AIKA Engine to fetch relevant legal guidance.
- **Document Simplification**: Allows users to input complex legal clauses, which the system then simplifies into plain language using predefined structural rules, helping users understand their rights and obligations without legal jargon.

## 5.3 Module 3: Case & Evidence Management

This module allows users to track their legal cases and manage supporting evidence securely.
- **Case Tracking**: Users can create, update, and monitor the status of their legal cases (e.g., Open, In Progress, Closed).
- **Evidence Vault**: Users can upload and link evidence (documents, images, links) to specific cases. The backend handles file metadata and associates it with the corresponding case IDs in MongoDB.

## 5.4 Module 4: Document Generation

The document generation module dynamically creates standard legal documents (like NDAs, Affidavits, or basic agreements).
- **Templates**: Pre-defined templates are stored in the system.
- **Customization**: Users fill out forms with specific details (names, dates, clauses).
- **Rendering**: The system injects user data into the templates and outputs downloadable documents (e.g., PDF or formatted text), streamlining the drafting process.

## 5.5 API / Backend Implementation - Code

The backend is structured using Express.js. Below is a snippet demonstrating the implementation of the JWT authentication middleware and a protected route.

**Auth Middleware (`middleware/auth.js`):**
```javascript
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
```

## 5.6 Frontend Implementation - Code

The frontend uses React and Tailwind CSS. Below is a snippet for a login component that handles user authentication and interacts with the backend API.

**Login Component (`src/components/Login.jsx`):**
```jsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response.data.msg || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">AIKA Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input 
          type="email" name="email" placeholder="Email" onChange={handleChange}
          className="w-full mb-4 p-2 border rounded" required 
        />
        <input 
          type="password" name="password" placeholder="Password" onChange={handleChange}
          className="w-full mb-6 p-2 border rounded" required 
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
```

---

# 6. RESULTS AND SCREENSHOTS

*(**NOTE TO USER**: Please insert your project screenshots directly below each heading. You can take screenshots of your running application and paste them here.)*

### 6.1 Home Page / Landing Page
*(Insert Screenshot Here - Show the main welcome screen of AIKA AI)*

### 6.2 User Registration and Login
*(Insert Screenshot Here - Show the signup and login forms)*

### 6.3 User Dashboard
*(Insert Screenshot Here - Show the dashboard where users can see their cases and tools)*

### 6.4 AI Legal Assistant / Simplifier
*(Insert Screenshot Here - Show the chat interface or text area where users interact with the AIKA Engine)*

### 6.5 Case and Evidence Management
*(Insert Screenshot Here - Show the list of cases and the interface for uploading evidence)*

---

# 7. CONCLUSION AND FUTURE ENHANCEMENT

### Conclusion
The AIKA AI platform successfully demonstrates the integration of the MERN stack to build a robust, user-friendly legal assistance tool. By utilizing an inbuilt rule-based AI engine, the platform provides immediate, accessible, and easily understandable legal information. The system efficiently handles user authentication, dynamic document generation, and secure case management, fulfilling the objective of democratizing legal knowledge and assisting users in navigating complex legal landscapes without immediate reliance on expensive professional counsel.

### Future Enhancement
- **Integration of Advanced NLP Models**: Upgrading from a deterministic rule-based engine to a machine learning-based NLP model (like a fine-tuned LLM) to handle highly complex and nuanced legal queries.
- **Multilingual Support**: Adding regional language translation to make the platform accessible to a wider demographic in diverse linguistic regions.
- **Lawyer Directory & Consultation Booking**: Implementing a feature that allows users to seamlessly book consultations with verified legal professionals directly through the platform when human intervention is required.
- **Automated Case Updates**: Integrating webhooks to provide real-time public court case status tracking.

---

# 8. REFERENCES

1. **MongoDB Documentation**: Official documentation for database setup and queries. [https://docs.mongodb.com/](https://docs.mongodb.com/)
2. **Express.js API Reference**: Routing and middleware implementation guidelines. [https://expressjs.com/](https://expressjs.com/)
3. **React.js Official Docs**: Component lifecycle, hooks, and state management. [https://reactjs.org/](https://reactjs.org/)
4. **Node.js Documentation**: Runtime environment and core modules. [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
5. **Tailwind CSS**: Utility-first CSS framework for rapid UI development. [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
6. **Mongoose Documentation**: Elegant MongoDB object modeling for Node.js. [https://mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)
7. **JSON Web Tokens (JWT)**: Industry standard for secure authentication transmission. [https://jwt.io/introduction/](https://jwt.io/introduction/)
