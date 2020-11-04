const mongoose = require('mongoose');

const user = new mongoose.Schema({
  userId: String,  // id of the user; doesn't change
  currency: { type: Number, min: 0 },
  lastClaimedDaily: { type: Date, default: new Date() },  // user will be able to claim currency daily
  servers: { type: Array, default: [] },  // list of server IDs the user has joined
  usernameDiscord: String
});

module.exports = mongoose.model('user', user);