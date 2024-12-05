const { usersData } = require('../db.js');
const file = require('fs');
const generator = require('generate-password');

const createPwd = async () => {
  const users = await usersData();
  users.forEach((user) => {
    user.auth = {
      password: generator.generate({
        length: 10,
        numbers: true,
      })
    }
  });
  file.writeFile('db.json', JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.log(err);
    }
  })

}

createPwd();