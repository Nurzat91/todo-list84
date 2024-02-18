import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const userRouter = express.Router();

userRouter.post('/', async (req, res, next) =>{
  try {
    const user = new User ({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();
    await user.save();
    return res.send(user);
  }catch (e){

    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});


userRouter.post('/sessions', async (req, res, next) =>{
  try {

    const user = await User.findOne({ username: req.body.username});

    if(!user){
      return res.status(422).send({error: 'Username and password are correct!'});
    }

    const userPassword = await user.checkPassword(req.body.password);

    if(!userPassword){
      return res.status(422).send({error: 'Username and password are correct!!'});
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'Username and password are correct!', user});
  }catch (e){
    next(e);
  }
});
export default userRouter;