const express = require("express");
(path = require("path")),
  (mongoose = require("mongoose")),
  (cors = require("cors")),
  (dbConfig = require("./database/db"));

const app = express();

// app.set("view engine", "ejs");

// const mongoConnectionString =
//   "mongodb://sumitn9095:%23SN85951055@cluster0-shard-00-00.jeq25.mongodb.net:27017,cluster0-shard-00-01.jeq25.mongodb.net:27017,cluster0-shard-00-02.jeq25.mongodb.net:27017/todo?tlsInsecure=true&ssl=true&replicaSet=atlas-8pnxsk-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((client) => {
    //const db = client.db("todo");
    //const usersCollection = db.collection("users");
    // app.post("/addusers", (req, res) => {
    //   usersCollection
    //     .insertOne(req.body)
    //     .then((result) => {
    //       console.log("RESULT", result);
    //     })
    //     .catch(console.error);
    // });
    // app.get("/users", (req, res) => {
    //   var usrs = [];
    //   usersCollection
    //     .find()
    //     .toArray()
    //     .then((result) => {
    //       res.render("index.ejs", { users: result });
    //       console.log("users", result);
    //     })
    //     .catch(console.error);
    //   //res.send(result);
    // });
   // console.log("Connected to DB",client);
  })
  .catch(console.error);

const userRoute = require("./routes/user.route");
const taskRoute = require("./routes/task.route");

app.use(cors());
app.use(express.static(path.join(__dirname, "dist/todo")));
app.use("/", express.static(path.join(__dirname, "dist/todo")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", taskRoute);
app.use("/api", userRoute);

// app.listen(5000, () => console.log(`Express running on port`, 5000));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
