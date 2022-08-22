import Todo from "../models/Todo.js";
import User from "../models/user.js";
import mongoose from "mongoose";

class TodoController {
  static GetAll(req, res) {
    Todo.find({}, (err, todos) => {
      if (err) {
        res.status(500).send({ err });
      } else {
        res.status(200).json({ todos });
      }
    });
  }

  static async GetUsers(req, res) {
    const username = req.body.username;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      res.status(500).send({ err: "User not found" });
    }
    await Todo.find({ created_by_username: username }, (err, todos) => {
      if (err) {
        res.status(500).send({ err });
      } else {
        res.status(200).json({ todos });
      }
    }).sort({ created_at: -1 });
  }

  static async GetOwn(req, res) {
    const username = res.locals.jwtPayload.username;
    await Todo.find({ created_by_username: username }, (err, todos) => {
      if (err) {
        res.status(500).send({ err });
      } else {
        res.status(200).json({ todos });
      }
    }).sort({ created_at: -1 });
  }

  static async GetTodo(req, res) {
    const id = req.params.id;
    await Todo.findById(id, (err, todo) => {
      if (err) {
        res.status(500).send({ err });
      } else {
        res.status(200).json({ todo });
      }
    });
  }

  static async CreateTodo(req, res) {
    const { title, content, status } = req.body;
    const username = res.locals.jwtPayload.username;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      res.status(500).send({ err: "User not found" });
    }
    const newTodo = new Todo({
      title,
      content,
      status,
      created_by_id: user.id,
      created_by_username: user.username,
    });
    newTodo.save((err, todo) => {
      if (err) {
        res.status(500).send({ err });
      } else {
        res.status(200).json({ todo });
      }
    });
  }

  static async UpdateTodo(req, res) {
    const id = req.body.id;
    const { title, content, status } = req.body;
    const username = res.locals.jwtPayload.username;
    let foundTodo = await Todo.findOne({ id }).exec();
    if (!foundTodo) {
      return res.status(404).send({
        error: "Todo not found",
      });
    }
    if (foundTodo.created_by_username !== username) {
      res.status(403).send({
        error: "Forbidden",
      });
    } else {
      await Todo.findByIdAndUpdate(id, {
        title,
        content,
        status,
      }).exec();
      foundTodo = await Todo.findOne({ id }).exec();
      return res.status(201).json({ foundTodo });
    }
  }

  static async DeleteTodo(req, res) {
    const id = req.body.id;
    const username = res.locals.jwtPayload.username;
    const foundTodo = await Todo.findById(id).exec();
    console.log({ foundTodo });
    if (!foundTodo) {
      res.status(404).send({
        error: "Todo not found",
      });
    }
    if (foundTodo.created_by_username !== username) {
      res.status(403).send({
        error: "Forbidden",
      });
    } else {
      const y = await Todo.findByIdAndDelete(id).then(() => {
        res.status(200).json();
      });
    }
  }
}

export default TodoController;
