const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    const con = await mongoose.connect("mongodb://127.0.0.1:27017");
    console.log("connected ....");
  } catch (error) {
    console.log("ERROR:", error);
  }
};

module.exports = connectToDb;
