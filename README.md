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
  "message": "Your message here"
}
Delete Conversation
DELETE /conversations/:id
Deletes a conversation and its history.
Example Usage
Create a new conversation
javascriptfetch('https://groq.leanderziehm.com/conversations', {
  method: 'POST'
})
.then(response => response.json())
.then(data => {
  const conversationId = data.id;
  console.log('New conversation created with ID:', conversationId);
});
Send a message
javascriptconst conversationId = '123e4567-e89b-12d3-a456-426614174000'; // Use the ID from the previous step

fetch(`https://groq.leanderziehm.com/${conversationId}/messages`, {
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

fetch(`https://groq.leanderziehm.com/conversations/${conversationId}`)
.then(response => response.json())
.then(data => {
  console.log('Conversation history:', data.messages);
});
Important Notes

