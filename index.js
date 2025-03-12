const http = require('http');
const url = require('url');

const users = []; // array to store users

const server = http.createServer((req, res) => {
  const { method, url: requestUrl } = req; // get the method and URL of the request

  // GET /users - get all users
  if (method === 'GET' && requestUrl === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users)); // send the array of users
  }

  // POST /users - create a new user
  else if (method === 'POST' && requestUrl === '/users') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString(); // collect the request body data
    });

    req.on('end', () => {
      const user = JSON.parse(body); // parse the received JSON data
      users.push(user); // add the new user to the array
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user)); // send a response with the new user (single object, not array)
    });
  }

  // PUT /users/:id - update a user by ID
  else if (method === 'PUT' && requestUrl.match(/^\/users\/\d+$/)) {
    const id = requestUrl.split('/')[2]; // get the ID from the URL
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString(); // collect the request body data
    });

    req.on('end', () => {
      const updatedUser = JSON.parse(body); // parse the new user data
      const userIndex = users.findIndex(user => user.id === parseInt(id)); // find the user by ID

      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser }; // update the user data
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users[userIndex])); // send the updated user
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' })); // if user not found
      }
    });
  }

  // DELETE /users/:id - delete a user by ID
  else if (method === 'DELETE' && requestUrl.match(/^\/users\/\d+$/)) {
    const id = requestUrl.split('/')[2]; // get the ID from the URL
    const userIndex = users.findIndex(user => user.id === parseInt(id)); // find the user by ID

    if (userIndex !== -1) {
      users.splice(userIndex, 1); // remove the user from the array
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User deleted' })); // confirmation of deletion
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' })); // if user not found
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' })); // if the route is not found
  }
});

// start the server on port 3000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

// badasya