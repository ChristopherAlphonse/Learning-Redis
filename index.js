import {
  getCache,
  removeCache,
  setCache,
} from "./controllers/redisController.js";

import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const { PORT, BASE_URL } = process.env;
const cacheKey = `getAll/posts`;

const app = express();

//Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  try {
    if (res) {
      res.status(200).send(`Welcome and we are Live ${PORT}`);
    }
  } catch (error) {
    res.status(400).send(error, () => {
      console.log(`Error ${error}`);
    });
  }
});

//GET Posts
app.get("/getAll", async (req, res, next) => {
  try {
    const response = {};
    const cacheData = await getCache(cacheKey);
    if (cacheData) {
      response["message"] = "cache hit";
      response["posts"] = JSON.parse(cacheData);
    } else {
      const result = await axios.get(BASE_URL);
      const { data } = result;
      response["message"] = "cache miss";
      response["posts"] = data;
      setCache(cacheKey, data);
    }
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err, () => {
      console.log(`Error ${err}`);
    });
  }
});

//Create new POST
app.post("/create", async (req, res, next) => {
  try {
    const response = await axios.post(BASE_URL, req.body);
    if (response) {
      const { data: posts } = response;
      removeCache(cacheKey);
      res.status(201).send(posts);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`App is running on 🙂 ${PORT}`);
});
