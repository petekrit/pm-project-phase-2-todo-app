const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = 3000;

// MySQL connection setup
let connection;
function connectToDatabase() {
  if (connection && connection.state === "authenticated") {
    return connection;
  }

  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  });
  console.log(connection)
  connection.connect((err) => {
    console.log("hellloooo connected", err)
    if (err) {
      console.error("Database connection failed: " + err.stack);
      return;
    }
    console.log("Connected to database");
  });

  return connection;
}

if (process.env.NODE_ENV !== "test") {
  connectToDatabase();
}

// EJS Middleware
app.set("view engine", "ejs");

// Middleware to parse POST request data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, client-side JavaScript)
app.use(express.static("public"));

app.use(express.json());


app.get("/", (req, res) => {
  // Retrieve tasks from the database
  connection.query("SELECT * FROM tasks", (error, results) => {
    if (error) throw error;

    const data = {
      tasks: results,
    };
    res.render("home", data);
  });
});

app.post("/addTask", (req, res) => {
  const newTask = req.body.newTask.trim();
  if (newTask !== "") {
    connection.query(
      "INSERT INTO tasks (value) VALUES (?)",
      [newTask],
      (error) => {
        if (error) {
          res.status(500).send("Internal Server Error");
          return;
        }
        connection.query("SELECT * FROM tasks", (err, results) => {
          if (err) {
            res.status(500).send("Internal Server Error");
            return;
          }
          const data = {
            tasks: results,
          };
          res.render("list", data);
        });
      }
    );
  } else {
    // Handle the case where the newTask is empty
    res.status(400).send("Bad Request: New task cannot be empty");
  }
});
app.post("/removeTask/:id", (req, res) => {
  const taskId = req.params.id;
  console.log(taskId);

  // Remove the task from the database
  connection.query("DELETE FROM tasks WHERE id = ?", [taskId], (error) => {
    if (error) {
      console.error("Error deleting task:", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("Task deleted successfully");

    // Retrieve updated tasks from the database
    connection.query("SELECT * FROM tasks", (err, results) => {
      if (err) {
        console.error("Error retrieving tasks:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      console.log("Tasks retrieved successfully");

      const data = {
        tasks: results,
      };

      // Render the "home" page with the updated data
      res.render("list", data);
    });
  });
});

function startServer() {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// In your main file, call this function only if not in test mode
if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = {
  app, connectToDatabase
}