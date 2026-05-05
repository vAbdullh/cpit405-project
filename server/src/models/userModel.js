/**
 * User Model (In-Memory Fake DB)
 * Replace with real ORM/ODM model when using a real database.
 */

let users = [
  { id: 1, name: "Abdullah", email: "abdullah@example.com" },
  { id: 2, name: "Sara", email: "sara@example.com" },
];

let nextId = 3;

const UserModel = {
  findAll: () => [...users],

  findById: (id) => users.find((u) => u.id === Number(id)) || null,

  create: ({ name, email }) => {
    const user = { id: nextId++, name, email };
    users.push(user);
    return user;
  },

  update: (id, data) => {
    const index = users.findIndex((u) => u.id === Number(id));
    if (index === -1) return null;
    users[index] = { ...users[index], ...data };
    return users[index];
  },

  delete: (id) => {
    const index = users.findIndex((u) => u.id === Number(id));
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};

module.exports = UserModel;
