const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const username = request.headers;

  const user = users.find(user => user.username === username)

  if (!user) {
    response.status(404).json({ error: 'user not found' });
  }

  req.user = user;

  return next();
}

function verifyExistsUser(username) {
  const user = users.some(user => user.username === username);

  if (user) {
    return true;
  }

  return false;
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const verifyUsername = verifyExistsUser(username);

  if (verifyUsername) {
    response.status(400).json({ error: 'username aleready exists' });
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }

  users.push(user);

  response.status(200).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { todos } = request;

  response.status(201).json( todos );
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;