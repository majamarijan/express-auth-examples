const express = require("express");
const app = express();
const path = require("path");
const { User } = require("./utils/Users");
const file = require('fs');


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
app.use('/users/:id', async (req, res, next) => {
  const user = await User.getUser(req.params.id);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(500).send('<h2>No user found</h2>');
  }
})

app.get('/users/:id', (req, res) => {
  res.send(`<h1>Welcome ${req.user.name}!</h1><p>Username: ${req.user.name}</p><p>email: ${req.user.email}</p>`);
});

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