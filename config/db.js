const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kmrsn.mongodb.net/social-network`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Failed to connect to MongoDB", error));
