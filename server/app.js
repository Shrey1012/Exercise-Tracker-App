const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoute = require("./routes/auth.js");
const exerciseRouter = require('./routes/exercise.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use('/api/exercise', exerciseRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});