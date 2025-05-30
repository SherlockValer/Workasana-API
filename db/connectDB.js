const mongoose = require("mongoose");

require("dotenv").config();

const workasanaURI = process.env.MONGODB;

const connectDB = async () => {
  await mongoose
    .connect(workasanaURI, {
      dbName: "workasana",
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferMaxEntries: 0,
      bufferCommands: false,
    })
    .then(() => console.log("Connected to Database."))
    .catch((error) => console.log(error));
};

module.exports = { connectDB };
