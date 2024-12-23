const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down service!");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

// improting it after setting up dotenv else the app won't have access to env
const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down service!");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
