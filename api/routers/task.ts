import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import auth from '../middleware/auth';

const taskRouter = express.Router();

taskRouter.post('/', auth, async (req, res, next) =>{
  try {
    const taskData= new Task ({
      user: req.body._id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });

    const task = new Task(taskData)
    await task.save();
    return res.send(task);
  }catch (e){

    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});
export default taskRouter;