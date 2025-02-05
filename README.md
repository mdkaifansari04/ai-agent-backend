# AI To-Do List Assistant

## Overview

This project is a simple AI-powered to-do list manager built using OpenAI's GPT-4o and a local MongoDB database. The AI agent assists users in managing tasks through structured workflows involving planning, execution, observation, and response.

## Features

- Add, delete, search, and list to-do tasks.
- Uses a structured workflow (PLAN → ACTION → OBSERVATION → OUTPUT).
- Interacts via command-line input.
- AI-powered task management.

## Technologies Used

- **Node.js** (Backend runtime)
- **OpenAI API** (AI-based task planning)
- **MongoDB** (Database for storing tasks)
- **Mongoose** (MongoDB ODM)
- **TypeScript** (for improved type safety)
- **Readline-sync** (CLI interactions)

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v16+)
- MongoDB (Running locally or on a cloud instance)
- OpenAI API key

### Steps to Install

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo/ai-agent-todo.git
   cd ai-agent-todo
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up environment variables**
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPEN_AI_API_KEY=your_openai_api_key
   MONGO_URI=your_mongodb_connection_string
   ```
4. **Start the application**
   ```sh
   npm start
   ```

## Usage

1. **Run the application:**
   ```sh
   npm start
   ```
2. **Interact via CLI:**
   - Example:
     ```sh
     >> Add a task for shopping groceries.
     Your task has been added successfully with ID 2.
     ```
3. **Available Commands:**
   - Add a task
   - Delete a task
   - List all tasks
   - Search tasks

## System Workflow

1. **START**: User inputs a task request.
2. **PLAN**: AI determines the best action.
3. **ACTION**: Executes the required function.
4. **OBSERVATION**: Retrieves results from the database.
5. **OUTPUT**: Returns a response to the user.

## API Functions

The AI agent interacts with the following functions:

- `getAllTodo()`: Fetches all to-dos.
- `createTodo(todo: string)`: Adds a new task.
- `deleteTodo(id: string)`: Deletes a task by ID.
- `searchTodo(query: string)`: Searches tasks.

## Example Interaction

```json
START
{ "type": "user", "user": "Add a task for shopping groceries." }
{ "type": "plan", "plan": "I will use createTodo to create a new Todo in DB." }
{ "type": "action", "function": "createTodo", "input": "Shopping for groceries." }
{ "type": "observation", "observation": "2" }
{ "type": "output", "output": "Your task has been added successfully." }
```

## Notes

- The AI follows a strict workflow for task execution.
- Responses are always in JSON format.
- The assistant can greet users when they initiate a conversation.

## License

This project is licensed under the **ISC License**.

## Author

Developed by **Md Kaif Ansari**.
