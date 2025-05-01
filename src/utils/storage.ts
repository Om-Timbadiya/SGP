// // Simple local storage database simulation
// const DB_KEYS = {
//   USERS: 'shrinu_users',
//   CURRENT_USER: 'shrinu_current_user',
// };

// export const storage = {
//   getUsers: (): User[] => {
//     const users = localStorage.getItem(DB_KEYS.USERS);
//     return users ? JSON.parse(users) : [];
//   },

//   saveUser: (user: User) => {
//     const users = storage.getUsers();
//     users.push(user);
//     localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
//   },

//   getCurrentUser: () => {
//     const user = localStorage.getItem(DB_KEYS.CURRENT_USER);
//     return user ? JSON.parse(user) : null;
//   },

//   setCurrentUser: (user: User | null) => {
//     if (user) {
//       localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
//     } else {
//       localStorage.removeItem(DB_KEYS.CURRENT_USER);
//     }
//   },

//   findUserByEmail: (email: string) => {
//     const users = storage.getUsers();
//     return users.find(user => user.email === email);
//   },
// };