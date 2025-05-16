require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Groq = require('groq-sdk');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// In-memory storage for conversation histories
// In a production app, you'd use a database instead
const conversations = {};

// Route to get all conversation IDs
app.get('/conversations', (req, res) => {
  res.json({
    conversations: Object.keys(conversations).map(id => ({
      id,
      created: conversations[id].created,
      updated: conversations[id].updated
    }))
  });
});

// Route to create a new conversation
app.post('/conversations', (req, res) => {
  const id = uuidv4();
  const timestamp = new Date().toISOString();
  
  conversations[id] = {
    messages: [],
    created: timestamp,
    updated: timestamp
  };
  
  res.status(201).json({ id });
});

// Route to get a specific conversation
app.get('/conversations/:id', (req, res) => {
  const { id } = req.params;
  
  if (!conversations[id]) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  res.json(conversations[id]);
});

// Route to send a message to Groq and get a response
app.post('/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, model = 'llama3-8b-8192' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (!conversations[id]) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Add user message to conversation history
    conversations[id].messages.push({ role: 'user', content: message });
    
    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: conversations[id].messages,
      model: model,
    });
    
    const assistantMessage = chatCompletion.choices[0].message;
    
    // Add assistant response to conversation history
    conversations[id].messages.push(assistantMessage);
    
    // Update the conversation's last updated timestamp
    conversations[id].updated = new Date().toISOString();
    
    res.json({ 
      response: assistantMessage.content,
      conversation_id: id
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process your request', details: error.message });
  }
});

// Route to clear a conversation's history
app.delete('/conversations/:id', (req, res) => {
  const { id } = req.params;
  
  if (!conversations[id]) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  delete conversations[id];
  res.status(204).send();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});