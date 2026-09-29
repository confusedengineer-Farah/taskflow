import { Router } from "express";
import auth from "../middleware/auth";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,    
  } from "../controllers/taskController"

const router = Router()

router.use(auth);

router.route("/").get(getTasks).post(createTask)
router.route("/:id").put(updateTask).delete(deleteTask)

export default router;