import express from 'express';
import mongoose, {Types} from 'mongoose';
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

taskRouter.put('/:id', async (req, res, next) =>{
  try{
    const taskId = req.params.id;

    let _id: Types.ObjectId;
    try {
      _id = new Types.ObjectId(taskId);
    } catch {
      return res.status(404).send({ error: 'Wrong Id!' });
    }

    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }


    const { title, description, status } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;

    const updatedTask = await task.save();
    return res.json(updatedTask);

  }catch (e){
    next(e);
  }
});

taskRouter.delete('/:id',  async (req, res, next) =>{
  try{

  }catch (e){
    next(e);
  }
});
export default taskRouter;
