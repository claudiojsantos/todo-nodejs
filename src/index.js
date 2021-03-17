const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username)

  if (!user) {
    response.status(404).json({ error: 'user not found' });
  }

  request.user = user;

  return next();
}

function verifyExistsUser(username) {
  const user = users.some(user => user.username === username);

  return user ? true : false;
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
  const { user } = request;

  response.json( user.todos );
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: deadline,
    created_at: new Date()
  }

  user.todos.push(todo);

  response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    response.status(404).json({ error: 'Mensagem do erro'});
  }

  todo.title = title;
  todo.deadline = deadline;
  
  response.status(201).json( { "deadline": todo.deadline, "done": todo.done, "title": todo.title } );
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    response.status(404).json({ error: 'Mensagem do erro'});
  }

  todo.done = true;

  response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
  
  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    response.status(404).json({ error: 'Mensagem do erro'});
  }

  user.todos.splice( todo, 1 );

  response.status(204).send();
});

module.exports = app;