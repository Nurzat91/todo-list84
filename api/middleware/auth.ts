import {Request, Response, NextFunction} from 'express';
import {HydratedDocument} from 'mongoose';
import {UserFields} from '../types';
import User from '../models/User';

export interface RequestWithUser extends Request {
  user?: HydratedDocument<UserFields>;
}
const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {

  const headerValue = req.get('Authorization');

  if(!headerValue){
    return res.status(401).send({error: 'No Authorization header present'});
  }

  const user = await User.findOne({headerValue});

  if(!user) {
    return res.status(401).send({error: 'Wrong token!'});
  }

  req.user = user;

  next();
};



export default auth;