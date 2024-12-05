const file = require('fs');
const path = require('path');
let users;

if (!file.existsSync(path.join(__dirname, './users.json'))) {
  file.writeFile(path.join(__dirname, './users.json'), JSON.stringify([], null, 2), (err) => {
    if (err) {
      console.log(err);
    }
  })
} else {
  users = require('./users.json');
}

function findUser(id) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(users.find((user) => user.id === Number(id)));
    }, 200);
  })
}

module.exports = {
  users,
  findUser
};