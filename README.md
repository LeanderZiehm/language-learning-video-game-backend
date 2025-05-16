Groq API Express Backend
This is a Node.js Express backend that serves as a middleware between your frontend and the Groq API. It allows you to interact with Groq's Large Language Models while maintaining conversation history.
Features

Create new conversations
Send messages to LLMs and get responses
Maintain conversation history
Support for multiple model options
Simple RESTful API design

Installation

Clone this repository
Install dependencies:

bashnpm install express cors dotenv uuid groq-sdk

Create a .env file in the root directory and add your Groq API key:

GROQ_API_KEY=your_groq_api_key_here
PORT=3000

Start the server:

bashnpm start
API Endpoints
Health Check
GET /health
Checks if the server is running.
List All Conversations
GET /conversations
Returns a list of all conversation IDs.
Create New Conversation
POST /conversations
Creates a new conversation and returns its ID.
Get Conversation
GET /conversations/:id
Returns all messages in a specific conversation.
Send Message
POST /conversations/:id/messages
Send a message to a specific conversation.
Request body:
json{
  "message": "Your message here",
  "model": "llama3-8b-8192" // Optional, defaults to llama3-8b-8192
}
Delete Conversation
DELETE /conversations/:id
Deletes a conversation and its history.
Example Usage
Create a new conversation
javascriptfetch('http://localhost:3000/conversations', {
  method: 'POST'
})
.then(response => response.json())
.then(data => {
  const conversationId = data.id;
  console.log('New conversation created with ID:', conversationId);
});
Send a message
javascriptconst conversationId = '123e4567-e89b-12d3-a456-426614174000'; // Use the ID from the previous step

fetch(`http://localhost:3000/conversations/${conversationId}/messages`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "message": "Explain quantum computing in simple terms",
    "model": "llama3-70b-8192" // Optional
  })
})
.then(response => response.json())
.then(data => {
  console.log('Response:', data.response);
});
Get conversation history
javascriptconst conversationId = '123e4567-e89b-12d3-a456-426614174000';

fetch(`http://localhost:3000/conversations/${conversationId}`)
.then(response => response.json())
.then(data => {
  console.log('Conversation history:', data.messages);
});
Important Notes

This implementation uses in-memory storage for conversation histories. For a production application, you should use a database instead.
Make sure to properly secure your API key and implement authentication for a production deployment.
