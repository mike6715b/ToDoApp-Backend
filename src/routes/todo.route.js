import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema.js";
import TodoController from "./../controllers/Todo.controller.js";
import { verifyJWT } from "./../middleware/verifyJWT.js";
import Joi from "joi";

const todoRouter = Router();

todoRouter.get("/todos", [verifyJWT], TodoController.GetAll);

const getTodoSchema = Joi.object({
  id: Joi.string().required(),
});
todoRouter.get(
  "/todo",
  [verifyJWT, validateSchema(getTodoSchema)],
  TodoController.GetTodo
);

todoRouter.get("/todoOwn", [verifyJWT], TodoController.GetOwn);

const getTodoUserSchema = Joi.object({
  username: Joi.string().required(),
});
todoRouter.get(
  "/todoUser",
  [verifyJWT, validateSchema(getTodoUserSchema)],
  TodoController.GetUsers
);

const putTodoSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.boolean().required(),
});
todoRouter.put(
  "/todo",
  [verifyJWT, validateSchema(putTodoSchema)],
  TodoController.UpdateTodo
);

const postTodoSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.boolean().required(),
});
todoRouter.post(
  "/todo",
  [verifyJWT, validateSchema(postTodoSchema)],
  TodoController.CreateTodo
);

const deleteTodoSchema = Joi.object({
  id: Joi.string().required(),
});
todoRouter.delete(
  "/todo",
  [verifyJWT, validateSchema(deleteTodoSchema)],
  TodoController.DeleteTodo
);

export default todoRouter;
