
const userSocketMap = new Map(); // (userId -> { id, name, socketId })

const addUser = (socket, userId, username) => {
  const userData = { id: userId, name: username, socketId: socket.id };
  userSocketMap.set(userId, userData);
  console.log(`Socket AUTH: User ${username} (ID: ${userId}) connected.`);
  broadcastOnlineUsers(socket.server);
};

const removeUser = (socket) => {
  if (socket.userId) {
    userSocketMap.delete(socket.userId);
    broadcastOnlineUsers(socket.server);
  }
};

const getSocketIdByUserId = (userId) => {
  return userSocketMap.get(Number(userId))?.socketId;
};
const broadcastOnlineUsers = (io) => {
  const onlineUsersList = Array.from(userSocketMap.values());
  io.emit("online_users", onlineUsersList);
};

module.exports = {
  addUser,
  removeUser,
  getSocketIdByUserId,
  broadcastOnlineUsers,
};