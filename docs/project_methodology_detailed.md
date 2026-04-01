# CHAPTER 3: METHODOLOGY

The Transparent Public Welfare Distribution platform is designed to provide an integrated and accountable ecosystem for managing disaster relief and humanitarian aid. This section describes the materials (technologies and tools) used for system development and the methodology followed to design, implement, and evaluate the system. The methodology ensures a systematic approach to building a scalable, secure, and highly transparent application that minimizes human bias through AI-driven triage.

## 3.1 MATERIALS USED
The development of the system requires a combination of hardware and software resources, along with modern web technologies and AI microservices to ensure efficiency, scalability, and real-time responsiveness.

### 3.1.1 Hardware Requirements
The proposed system does not require specialized high-end server hardware for its core development, making it accessible for deployment in various infrastructure environments. It can be developed and efficiently operated on standard computing devices such as laptops or desktops. A system with at least an Intel i3 processor or its equivalent is sufficient to handle the basic processing requirements, while a minimum of 4 GB RAM is needed to ensure smooth performance; however, 8 GB RAM is recommended for better speed and multitasking capabilities, especially when running the React frontend, Node.js backend, and the Python AI-server simultaneously. Additionally, since the system relies on cloud-based database services (MongoDB Atlas) and real-time API communication, a stable internet connection is essential for seamless functionality and data synchronization.

### 3.1.2 Software Requirements
The proposed system is developed using a multi-tiered full-stack architecture that ensures scalability and efficient performance. The frontend of the application is built using React.js (leveraging Vite), a powerful JavaScript library for creating dynamic and interactive user interfaces. React.js enables the development of reusable components, improving maintainability and enhancing the overall user experience during crisis management. On the backend, the system utilizes Node.js along with Express.js, providing a robust environment for handling concurrent requests from beneficiaries, NGOs, and volunteers. Unique to this system is the integration of a Python-based AI microservice using Flask, which facilitates specialized Natural Language Processing (NLP) for aid request prioritization. 
For data storage, the system employs MongoDB, a NoSQL database that stores data in a flexible format, making it highly suitable for handling unstructured aid descriptions and rapidly growing activity logs. Development is primarily carried out in Visual Studio Code, chosen for its lightweight nature and extensive support for the MERN stack and Python. Version control and collaboration are managed through Git and GitHub, ensuring a transparent development history.

### 3.1.3 Libraries and Frameworks
The system incorporates several essential libraries and tools to enhance functionality, security, and overall performance. For client-side navigation, React Router is used, enabling seamless transitions between user dashboards, request forms, and public logs without reloading the application. To handle communication between the frontend, backend, and the AI service, Axios is utilized for managing high-frequency HTTP requests. For data visualization, Recharts is implemented to provide interactive charts that display aid distribution progress and resource allocation analytics.
For authentication and security, the system uses JSON Web Token (JWT), which ensures secure user sessions and enforces Role-Based Access Control (RBAC) across the four user types (User, Volunteer, NGO, Admin). Additionally, bcryptjs is implemented for password encryption, ensuring that user credentials remain protected against unauthorized access. On the database side, Mongoose is used as an Object Data Modeling (ODM) library for MongoDB, simplifying CRUD operations and ensuring data integrity through structured schema validation.

### 3.1.4 Additional Tools
The system also utilizes several supporting tools to improve development efficiency, design quality, and data visualization. For API testing and debugging, Postman is used to verify the responses of the Node.js endpoints and the Python AI-server, ensuring that priority assessments are correctly assigned before frontend integration. For designing the user interface and ensuring an intuitive user journey for disaster victims and volunteers, Figma is employed to create wireframes and prototypes. 
To monitor system health and security, Helmet.js and Morgan are integrated into the backend to provide protection against common web vulnerabilities and to log server-side activity for debugging. MongoDB Compass is used for local database management and query optimization. Finally, the application is designed for cloud-native deployment using platforms like Vercel for the frontend and Heroku or Render for the backend, ensuring global accessibility.

---

## 3.2 METHODOLOGY
The development of the Transparent Public Welfare Distribution platform follows a structured methodology based on the Software Development Life Cycle (SDLC). The process begins with requirement analysis, where the critical needs for transparency and automated triage are identified. This is followed by system design, which defines the multi-service architecture (MERN + Python AI). An iterative approach is adopted, allowing the system to be built in modules—such as the AI microservice and the Activity Log—with continuous testing and feedback. This ensures that the platform remains flexible and can scale to meet the high demands of real-world relief operations.

### 3.2.1 Requirement Analysis
In this phase, system requirements are gathered based on the challenges found in traditional, opaque aid distribution systems. Key user requirements include a centralized aid request portal, automated urgency categorization via AI, and an immutable public audit trail (Activity Log). These requirements help in understanding the specific interactions needed between NGOs and Volunteers. The system scope is clearly defined to include core distribution workflows while ensuring data privacy for beneficiaries. Additionally, existing disaster management tools are studied to identify gaps, such as the lack of real-time public transparency, which this project addresses specifically through its automated logging mechanism.

### 3.2.2 System Design
The system design phase defines the overall architecture and structure of the application. It outlines how different components such as the React frontend, the Node.js backend, the Python AI-server, and the MongoDB database interact with each other. This phase includes designing system workflows, data schemas, and role-based user interfaces.

| Module Name | Description |
| :--- | :--- |
| **Authentication Module** | Manages user login, registration, and secure JWT access control. |
| **Aid Request Module** | Handles submission of welfare needs, including category and description. |
| **AI Prioritization Engine** | Utilizes NLP to analyze request urgency and assign priority levels. |
| **NGO/Volunteer Portal** | Facilitates the assignment and tracking of aid delivery tasks. |
| **Activity Log (Audit Trail)** | Publicly visible record of all status changes for 100% transparency. |
| **Analytics Dashboard** | Visualizes aid distribution statistics using interactive charts. |
| **Database (MongoDB)** | Stores user profiles, aid requests, and immutable activity records. |
| **Backend (Node.js/Express)**| Orchestrates API requests and enforces role-based security. |
| **Frontend (React.js)** | Provides the user interface for request submission and tracking. |

**Table 3.1. System Modules Description**

#### 3.2.2.1 Architecture Design
The system is designed using a three-tier architecture, enhanced with an external AI microservice, which ensures better scalability and separation of concerns. The Presentation Layer (Frontend) is responsible for the user interface and is developed using React.js and TailwindCSS, providing a responsive experience for all stakeholders. The Application Layer (Backend) handles the core business logic using Node.js and Express, while a parallel AI Layer (Flask) processes incoming text for priority assessment. Finally, the Data Layer (Database) utilizes MongoDB to manage application data in a flexible and horizontally scalable manner. This layered architecture allows each component to function independently, enabling the AI server to be updated or retrained without affecting the main application availability.

#### 3.2.2.2 Module Design
The system uses a structured database design with multiple collections to efficiently store and manage humanitarian data. The User Collection stores profile-related details, role permissions, and contact info. The Aid Requests Collection maintains records of all help requests, including their AI-assigned priority (Critical, High, Medium, Low) and current status. The Activity Log Collection is an immutable record that captures every interaction, such as when an NGO accepts a request or a Volunteer completes a delivery. Together, these collections ensures organized data management, rapid auditability, and efficient retrieval for public monitoring.

### 3.2.3 System Implementation
The implementation phase involves coding and integration of all system modules. Developers build the React UI, the Node/Express backend, and the Python NLP service according to design specifications. Each module is integrated to ensure that a request submitted in the frontend is correctly processed by the AI and logged in the database.

| Module | Component | Description |
| :--- | :--- | :--- |
| **Frontend Development** | **UI & Transitions** | Built with React and Framer Motion for smooth UX. |
| | **Dashboards** | Role-specific views for Users, NGOs, and Admins. |
| **Backend Development** | **RESTful APIs** | Secure endpoints built using Node.js and Express. |
| | **AI Bridge** | Integration logic to communicate with the Flask AI-server. |
| **AI Microservice** | **NLP Model** | Python-based text classification for triage automation. |
| **Database Implementation**| **Scalable Schema** | MongoDB collections designed for high-volume logs. |

**Table 3.2. Technology Implementation Details**

---

## 3.3 KEY FUNCTIONAL METHODOLOGY

| Module | Process | Description |
| :--- | :--- | :--- |
| **User Onboarding** | Registration & Auth | Users register via Bcrypt-hashed passwords and receive JWT tokens. |
| **Aid Request Flow** | Submission & Triage | User submits a request; AI immediately assigns priority level. |
| **Operational Workflow**| Task Management | NGOs and Volunteers accept and update aid delivery status. |
| **Transparency Engine** | Activity Logging | System auto-generates a public log for every status change. |

**Table 3.3. System Process Description**

---

## 3.4 TESTING METHODOLOGY
Testing plays a crucial role in ensuring the system’s reliability during high-pressure disaster events. In this phase, Unit Testing is performed first, where individual components like the AI priority model and the authentication middleware are tested separately. This is followed by Integration Testing, which ensures smooth data flow between the React frontend, the Node backend, and the Python AI-server. Finally, System Testing is conducted, where the entire application is tested end-to-end to validate that aid requests are correctly triaged and that the resulting activity logs are immutable and publicly visible.

## 3.5 SECURITY MEASURES
The system incorporates multiple security measures to ensure data protection and safe access for vulnerable populations. Password encryption is implemented via Bcrypt to securely store credentials. Role-Based Access Control (RBAC) is strictly enforced to ensure that only verified NGOs and Volunteers can perform delivery updates. Secure API endpoints are established using JWT to verify every request, while backend middleware like Helmet.js is utilized to protect against common web attacks, ensuring that the platform remains a safe and trusted tool for public welfare distribution.

## 3.6 DEPLOYMENT METHODOLOGY
The system deployment is carried out using reliable cloud-based platforms to ensure scalability and global accessibility. The backend is deployed on cloud platforms such as Heroku or Render, which provide efficient environments for hosting Node.js applications and Python microservices. The frontend is hosted using Netlify or Vercel, enabling fast delivery through global CDNs. The database is hosted on MongoDB Atlas, ensuring secure data storage, automatic backups, and high availability even during peak usage periods.

## 3.7 WORKFLOW OF THE SYSTEM
The system workflow follows a clear and integrated "Request-Analyze-Verify-Deliver" loop, ensuring that critical aid is prioritized and every interaction is recorded for transparency. A Public User submits an aid request via the React frontend, which is instantly analyzed by the Python AI service to determine its urgency. Once categorized, the request appears on the dashboards of Volunteers and NGOs. As these stakeholders accept and complete deliveries, the Node.js backend automatically generates corresponding entries in the public Activity Log, providing a verifiable trail of accountability for all observations.

![System Workflow Diagram for Transparent Public Welfare Distribution](C:\Users\ADMIN\.gemini\antigravity\brain\3ddabe57-a3dd-4e89-950e-7a27a3c4ab9f\welfare_workflow_white_bg_1774861478686.png)
**Figure 3.1. User journey and data transition in the welfare distribution ecosystem with white background.**

## 3.8 ADVANTAGE OF METHODOLOGY
The architectural approach chosen for this project provides several key advantages in terms of reliability, transparency, and operational efficiency. By leveraging a modular design, each service—such as the AI priority engine or the logging mechanism—can be developed and tested independently, reducing system downtime. The use of automated AI triage eliminates human subjectivity and delay during high-pressure relief scenarios. Furthermore, the immutable activity logging mechanism builds public trust by providing a permanent, non-repudiable record of all humanitarian activities, ultimately ensuring that limited resources are distributed fairly and effectively to the most vulnerable.
