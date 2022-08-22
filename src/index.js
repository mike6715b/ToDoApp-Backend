import dotenv from "dotenv";
dotenv.config();

import Express from "express";
import { mongoose } from "mongoose";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import todoRouter from "./routes/todo.route.js";

const originWhitelist = ["*"];

const app = Express();
const port = 3000;

var corsOptions = {
  // origin: function (origin, callback) {
  //   if (originWhitelist.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // }
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
  allowedHeaders: "Content-Type, Authorization, X-Requested-With, X-CSRF-Token",
  methods: "GET,HEAD,PUT,POST,DELETE",
};

app.use(helmet()); // helmet is a security package that helps you secure your Express apps by setting various HTTP headers.
app.use(cors(corsOptions)); // cors is a middleware that allows cross-origin requests.
app.use(Express.json()); //parse JSON bodies
app.use(cookieParser()); //parse cookies

app.use("/api/auth", authRouter);
app.use("/api/", todoRouter);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database!");
  })
  .catch((err) => {
    console.log("Connection failed to MongoDB! Err: " + err);
  });

app.get("/api/ping", (req, res) => {
  console.log("Ping received!");
  res.json("pong");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
