const generator = require('generate-password');

module.exports.createPwd = () => {
  const password = generator.generate({
    length: 10,
    numbers: true
  });
  return password;
}