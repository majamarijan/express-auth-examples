const { usersData } = require("../api.js");
const file = require('fs');
const path = require('path');
const _users = require('../data/users.js');
const { createPwd } = require("./createPasswords.js");


class Users {

  addUser(params) {
    const user = { ...params };
    _users.push(user);


    return user;
  }

  removeUser(id) {
    const users = _users.filter((user) => user.id !== Number(id));
    return users;
  }

  async getUsers() {
    const users = await usersData();
    if (users.length > 0) {
      // create json file
      const updated = users.map((user) => {
        return { ...user, username: user.username.toLowerCase(), email: user.email.toLowerCase(), password: createPwd() }
      });
      file.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(updated, null, 2), (err) => {
        if (err) {
          console.log(err);
        }
      })
    }
    return users;
  }

  async getUser(id) {
    const user = await _users.findUser(Number(id));
    if (user && user.id) {
      return user;
    }
    return null;
  }

  updateUser(id, props) {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      this.users = this.users.map((user) => {
        if (user.id === id) {
          return { ...user, ...props };
        }
        return user;
      });
    }
    return user;
  }

  getAdmin(id) {
    const user = this.users.find((user) => user.id === Number(id));
    if (user) {
      return user.isAdmin;
    }
    return false;
  }
}

const User = new Users();

module.exports = { User };