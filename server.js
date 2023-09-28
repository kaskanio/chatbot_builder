const express = require('express');
const cors = require('cors'); // Import the cors package
const helmet = require('helmet');
const app = express();
const port = 3002; // You can change the port if needed

// Middleware to parse JSON requests
app.use(cors());

// Define your routes and endpoints here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data:'],
    },
  })
);
// Sample data (replace with your data structure)
const intents = [
  {
    id: 1,
    name: 'greet',
    strings: [
      'hey',
      'hello',
      'hi',
      'hello there',
      'good morning',
      'good evening',
      'moin',
      'hey there',
      "let's go",
      'hey dude',
      'goodmorning',
      'goodevening',
      'good afternoon',
    ],
  },
  {
    id: 2,
    name: 'bot_challenge',
    strings: [
      'are you a bot?',
      'are you a human?',
      'am I talking to a bot?',
      'am I talking to a human?',
    ],
  },
  { id: 3, name: 'Intent 3', strings: ['NANI', 'NE RE'] },
];

// Route to get intents
app.get('/intents', (req, res) => {
  res.json(intents);
});

// Route to get a specific intent by ID
app.get('/intents/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const intent = intents.find((intent) => intent.id === id);
  if (!intent) {
    return res.status(404).json({ error: 'Intent not found' });
  }
  res.json(intent);
});

app.get('/intents/:id/strings', (req, res) => {
  const id = parseInt(req.params.id);
  const intent = intents.find((intent) => intent.id === id);
  if (!intent) {
    return res.status(404).json({ error: 'Intent not found' });
  }
  const strings = intent.strings;
  res.json(strings);
});

app.get('/intents/:id/strings/:index', (req, res) => {
  const id = parseInt(req.params.id);
  const index = parseInt(req.params.index);

  const intent = intents.find((intent) => intent.id === id);
  if (!intent) {
    return res.status(404).json({ error: 'Intent not found' });
  }

  const strings = intent.strings;
  if (index < 0 || index >= strings.length) {
    return res.status(404).json({ error: 'String index out of bounds' });
  }

  const specificString = strings[index];
  res.json(specificString);
});
