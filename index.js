const express = require("express");
const app = express();
const path = require("path");
const { User } = require("./utils/Users");
const file = require('fs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "src")));



app.use((req, res, next) => {
  console.log(req.url);
  next();
})


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, "src", "about.html"));
})

//data path
app.use('/data', async (req, res, next) => {
  const users = await User.getUsers();
  if (users) {
    req.users = users;
    next();
  }
})
app.get('/data', (req, res, next) => {
  res.json({ message: 'OK', users: req.users });
})


// get specific user
app.use('/users/user', async (req, res, next) => {
  const id = req.query['userid'];
  if (id) {
    const user = await User.getUser(id);
    if (user) {
      req.user = user;
      next();
    }
  }
})

app.get('/users/user', (req, res) => {
  res.json({ message: 'OK', user: req.user });
})

app.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, "src", "users.html"));
})





//login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "src", "login.html"));
})

app.post('/auth', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === user.username && password === user.auth.password) {
    res.send('ok')
  } else {
    res.redirect('/login')
  }
})



app.get('/dashboard', (req, res, next) => {
  const id = req.query['username'];
  if (id === user.username) {
    res.send(`<h1>Welcome ${user.name}!</h1><p>Username: ${user.name}</p><p>email: ${user.email}</p><a href='/logout'>Logout</a>`);
  }
})

app.get('/logout', (req, res) => {
  res.redirect('/')
})


//check for admin
async function adminMiddelware(req, res, next) {
  const id = req.query['id'];
  const admin = await User.getAdmin(id);
  console.log(admin)
  if (admin) {
    next();
  } else {
    res.status(500).send('No admin found');
  }
}

app.use('/admin', adminMiddelware);
app.get('/admin', (req, res) => {
  res.send('<h1>Admin Page!</h1>');
});


function errorHandler(req, res, next) {
  res.status(404).sendFile(path.join(__dirname, "src", "404.html"));
}

app.use('*', errorHandler);




app.listen(3000, () => {
  console.log("Listening on port 3000");
})