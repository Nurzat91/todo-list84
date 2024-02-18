import express from 'express';
import mongoose from 'mongoose';

import userRouter from './routers/user';
import taskRouter from './routers/task';
import config from './config';


const app = express();
const port = 8000;

app.use(express.json());

app.use('/tasks', taskRouter);
app.use('/users', userRouter);


const run = async () => {

  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });

  process.on('exit', () => {
    mongoose.disconnect();

  });
};
void run();