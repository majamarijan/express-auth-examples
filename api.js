async function usersData() {
  const users = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await users.json();
  return data;
}

module.exports = { usersData };