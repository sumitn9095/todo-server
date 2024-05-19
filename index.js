const express = require("express");
(path = require("path")),
(mongoose = require("mongoose")),
(cors = require("cors")),
(dbConfig = require("./database/db"));
const helmet = require("helmet");
let multer = require("multer");

const test = require("./test");
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
const userTaskRoute = require("./routes/usertask.route");
const userCategoryRoute = require("./routes/category.route");
const userHobbyRoute = require("./routes/hobby.route");

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(helmet({crossOriginResourcePolicy: false}));
app.use(cors());
app.use(express.static(path.join(__dirname, "dist/todo")));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"public/images")));
app.use(express.static(path.join(__dirname,"public/xlsx")));
app.use(express.static(path.join(__dirname,"dist")));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());



const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileStorageTaskExcel = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/xlsx');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileFilterTaskExcel = (req, file, cb) => {
  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('taskphoto'));
// app.use(multer({ storage: fileStorageTaskExcel }).array('taskexcel'));


// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/upload-document");
//   },
//   filename: function (req, file, cb) {
//     var ext = file.originalname.split(".").pop();
//     cb(null, file.originalname);
//   },
// });

// var upload = multer({ storage: storage });

app.use("/api", taskRoute);
app.use("/api", userRoute);
app.use("/api", userTaskRoute);
app.use("/api", userCategoryRoute);
app.use("/api", userHobbyRoute);

// app.listen(5000, () => console.log(`Express running on port`, 5000));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});


console.log("test.pathInfo--------->",test.pathInfo);
