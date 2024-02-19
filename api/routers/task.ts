import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import auth, {RequestWithUser} from '../middleware/auth';

const taskRouter = express.Router();

taskRouter.post('/', auth, async (req: RequestWithUser, res, next) =>{
  try {

    const user = (req as RequestWithUser).user;
    const taskData = new Task({
      user: user,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status
    });

    console.log(taskData);
    console.log('user', user);
    // const task = new Task(taskData)
    await taskData.save();
    return res.send(taskData);
  }catch (e){

    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

taskRouter.get('/', async (req, res, next) =>{
  try{
    const tasks = await Task.find();
    return res.send(tasks);

  }catch (e){
    next(e);
  }
});
export default taskRouter;