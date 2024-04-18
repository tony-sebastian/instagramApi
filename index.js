const express = require('express');
const bodyParser = require('body-parser');
// const helmet = require('helmet');
// const cors = require('cors'); // Optional, uncomment if needed
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from `.env`

const app = express();

// Body parsing middleware
app.use(bodyParser.json());

// Replace with your verification token from Instagram
const VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN;

// Verification endpoint (GET)
app.get('/v1/instagram/webhook', (req, res) => {
  const challenge = req.query['hub.challenge'];

  // Check if challenge exists
  if (challenge) {
    // Validate token (optional, for extra security)
    if (req.query['hub.verify_token'] === VERIFICATION_TOKEN) {
      console.log('Received challenge from Instagram:', challenge);
      // Respond with only the challenge value
      // Set content type to text/plain
      res.setHeader('Content-Type', 'text/plain');
      return res.send(challenge);
    } else {
      console.error('Invalid verification token');
      return res.status(403).send('Forbidden');
    }
  } else {
    console.error('Missing hub.challenge parameter');
    return res.status(400).send('Bad Request');
  }
});

// Webhook notification endpoint (POST)
app.post('/v1/instagram/webhook', (req, res) => {
  const data = JSON.stringify(req.body);

  console.log('Received webhook notification:', data);

  // Process the webhook data (e.g., new comments, follows)
  // Implement your business logic here

  // Send a successful response back to Instagram
  res.sendStatus(200);
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
