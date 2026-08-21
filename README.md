# modern_tech_back


# ModernTech Solutions HR Management System

A database-driven HR management system developed for ModernTech Solutions using Node.js, Express.js, and MySQL.

The system manages employee information, payroll, attendance, leave, performance, and user authentication.

## Page Login Details
email: hr@moderntech.co.za
password: 57940

## Technologies Used

- Node.js
- Express.js
- MySQL
- HTML
- CSS
- JavaScript
- GitHub

## Installation and Setup

1. Clone the repository.
2. Install the required dependencies:

npm install

3. Configure the database connection using the environment variables.
4. Make sure MySQL is running.
5. Start the server:

node index.js

6. Open the application in your browser using the provided localhost address.

Database
The system uses MySQL to store HR information.
The database contains related information for areas such as:
Employees
Payroll
Attendance
Leave
Performance
User authentication
Primary keys and foreign keys are used to create relationships between tables and maintain data integrity.
Authentication and Security
The system includes user authentication and role-based access control to help protect the application and control access to different features.
Server-side validation is used to check information before it is processed or stored.
Environment variables are also used to keep sensitive configuration information separate from the main source code.
API
The backend provides API endpoints that allow the frontend to communicate with the database.
The system supports operations such as:
GET – Retrieve information
POST – Create new records
PUT – Update existing records
DELETE – Remove records
Authentication requests
Testing
The main features of the system were tested to make sure the frontend, backend, and database work together correctly.
Testing included:
User authentication
Employee management
Payroll
Leave management
Attendance
Performance management
Database persistence
Input validation
Error handling
Team Contributions
Michaela – Payroll & Authentication
I worked mainly on the payroll management and authentication parts of the project. I developed the payroll functionality and worked on the API CRUD operations, including creating, retrieving, updating, and deleting payroll records. I also connected the payroll system to the MySQL database to make sure payroll information is stored and retrieved correctly. In addition, I contributed to the authentication functionality and worked with authentication middleware to help protect routes and control access to different parts of the system based on the user's authentication and role.
 Kanya Masinda
– Employee Management & Authentication
I worked mainly on the employee management and authentication sections of the project. I developed functionality for managing employee information and worked on connecting the employee features to the backend and database. I also contributed to the authentication and authorization functionality, helping to control user access to different parts of the system. This included working with validation and middleware to make sure information was handled correctly and that protected features could only be accessed by authorised users.
Cial Hendricks
– Leave & Attendance Management
I worked mainly on the leave and attendance sections of the project. I developed functionality that allows employee leave and attendance information to be recorded and managed through the system. I worked on connecting these features to the backend and database so that information could be stored and retrieved when needed. I also helped with testing the functionality and making sure the system provided appropriate feedback when users entered information or performed actions.
Likona Mkhatshana
– Performance Management & Optimization
I worked mainly on the performance management and system optimization sections of the project. I developed functionality for managing employee performance information and worked on making the feature accessible through the HR system. I also contributed to improving the efficiency of the system by focusing on database queries and backend operations. Testing was carried out to make sure the performance functionality worked correctly and that the system could handle the information efficiently.
Version Control
GitHub was used throughout the project for source code management and collaboration.
Team members worked on separate branches, committed their changes, and combined their work into the main project.
GitHub also allowed us to track changes and maintain different versions of the project.
Future Improvements
Possible future improvements include:
Cloud deployment
Additional HR reports
More advanced role permissions
Further database optimization
Additional regional HR functionality
Improved performance monitoring
Conclusion
The ModernTech Solutions HR Management System provides a centralised platform for managing important HR processes.
By combining a frontend, Node.js and Express.js backend, and MySQL database, the system provides a structured solution for managing employee information, payroll, attendance, leave, performance, and authentication.

PORT=2020
JWT_SECRET=moderntech-super-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=kanyamasinda06@
DB_PORT=3307
DB_NAME=modern_tech
NODE_ENV=development


