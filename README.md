# Emailing Website College Training Final Project

This project is a messaging website that allows users to sign up, log in, send, and view messages. It also includes functionality for sending email notifications. The project is built with Node.js on the backend, and the front end is crafted using HTML, CSS, and JavaScript.

## Project Structure

### Root Files

- **`server.js`**: The main entry point for the Node.js server. It sets up the Express server, connects to the MySQL database, and handles routing for the API.
- **`db.js`**: Contains the MySQL database connection setup and functions to interact with the database (e.g., storing and retrieving user data, messages).
- **`package.json`**: Defines the project's dependencies, such as Express, MySQL, `jsonwebtoken`, and `bcrypt`, and includes scripts for starting the server.
- **`package-lock.json`**: Automatically generated file that locks the dependency versions installed via npm.
- **`README.md`**: Provides an overview of the project, its structure, and functionality.

### Public Directory

This directory contains all the front-end files:

- **`index.html`**: The homepage of the website where users can navigate to sign up or log in.
- **`signup.html`**: The sign-up page where users can create a new account.
- **`signup_style.css`**: The CSS file that styles the sign-up page.
- **`account.html`**: Displays the user's account details and allows the user to update their information.
- **`account_style.css`**: The CSS file that styles the account page.
- **`message.html`**: The page for composing and sending messages to other users.
- **`style_message_page.css`**: The CSS file that styles the message composition page.
- **`view_message.html`**: The page where users can view their received or sent messages.
- **`style_view_message.css`**: The CSS file that styles the message viewing page.
- **`style_Home_page.css`**: The CSS file that styles the homepage.
- **`script.js`**: Contains client-side JavaScript code for form validation, handling UI interactions, and AJAX requests to the backend.
- **`photos/`**: A directory where user-uploaded images, such as profile pictures, are stored.

### Functionality

- **User Authentication**: Users can create an account, log in, and access their account details. Passwords are securely hashed using `bcrypt`.
- **Message Sending**: Users can compose and send messages to other users, which are stored in the MySQL database.
- **Message Viewing**: Users can view a list of their sent and received messages.
- **Email Notification**: When a user receives a new message, an email notification is sent to their registered email address.
- **JWT Authentication**: The project uses JSON Web Tokens (JWT) to authenticate users and manage sessions.

## Setup Instructions

1. Clone the repository to your local machine.
    ```bash 
    git clone https://github.com/MahmoudGmy/simple-message-website.git
    ```

2. Navigate to the project directory and run `npm install` to install the necessary dependencies.

3. Set up your MySQL database and update the connection details in `db.js`.

4. Start the server by running:
    ```bash
    npm run devStart
    ```

5. Open `index.html` in a web browser to access the application.

## Server Code

Here is a brief overview of the key parts of the server code:

### Dependencies

The project uses the following middleware and libraries:

- `express`: To handle routing and serve static files.
- `path`: To work with file and directory paths.
- `body-parser`: To parse incoming request bodies in a middleware.
- `mysql2`: To interact with the MySQL database.
- `jsonwebtoken`: To generate and verify JWT tokens for user authentication.
- `bcrypt`: For hashing and comparing passwords securely.

### Key Endpoints

- **POST `/submit`**: Sends a message from the logged-in user to another user.
- **POST `/register`**: Registers a new user, hashes their password, and generates a JWT token.
- **POST `/login`**: Logs in an existing user by verifying their password and generates a JWT token.
- **GET `/view`**: Displays the user's sent and received messages.
- **GET `/Profile`**: Displays the user's account information.
- **GET `/api/users`**: Retrieves the details of the logged-in user.
- **GET `/api/messages`**: Retrieves the messages for the logged-in user.

### Starting the Server

The server listens on port `3001`:
```javascript
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
