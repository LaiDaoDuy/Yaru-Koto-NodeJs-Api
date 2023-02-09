import { NextFunction, Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { checkJwt } from '../middleware/checkJwt.middleware';
import { UserService } from '../services/UserService';
import { User } from '../bo/entities/User';
import { Service } from 'typedi';
import Log from '../utils/Log';
import { NotFoundException } from '../exceptions/NotFoundException';

@Service()
@Controller('api/user')
export class UserController {
  private className = 'UserController';
  constructor(private readonly userService: UserService) {}

  @Put()
  @Middleware([checkJwt])
  private async up(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateUser', `RQ`, { req: req });

    try {
      const userBody: User = <User>req.body;
      const user: User = await this.userService.findById(userBody.usr);
      if (!user) {
        throw new NotFoundException(userBody.usr);
      }
      const newUser: User = await this.userService.update(userBody.usr, userBody);

      res.status(200).json({ data: newUser });
    } catch (e) {
      next(e);
    }
  }
}
