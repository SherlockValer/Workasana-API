const mongoose = require("mongoose");

require("dotenv").config();

const workasanaURI = process.env.MONGODB;

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  await mongoose
    .connect(workasanaURI, { dbName: "workasana" })
    .then(() => console.log("Connected to Database."))
    .catch((error) => console.log(error));
};

module.exports = { connectDB };
