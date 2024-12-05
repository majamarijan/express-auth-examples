const { usersData } = require("../db");
const file = require('fs');
const path = require('path');
const users_path = path.join(__dirname, 'db.json');


class Users {
 
  addUser(params) {
    const user = {...params};
    file.readFile(users_path, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }
      const users = JSON.parse(data);
      users.push(user);
      file.writeFile(users_path, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.log(err);
        }
      });
    })
    return user;
  }

  removeUser(id) {
    file.readFile(users_path, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const users = JSON.parse(data);
        const result = users.filter((user) => user.id !== Number(id));
        file.writeFile(users_path, JSON.stringify(result, null, 2), (err) => {
          if (err) {
            console.log(err);
          }
        })
      }
    }) 
    
  }

  async getUsers() {
    const users = await usersData();
    return users;
  }

  async getUser(id) {
    const user = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    const data = await user.json();
    if (data && data.id) {
      return data;

    }

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