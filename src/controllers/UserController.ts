import { NextFunction, Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { checkJwt } from '../middleware/checkJwt.middleware';
import { checkRole } from '../middleware/checkRole.middleware';
import { UserService } from '../services/UserService';
import { User } from '../bo/entities/User';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';
import Log from '../utils/Log';
import { NotFoundException } from '../exceptions/NotFoundException';
import { ExistedException } from '../exceptions/ExistedException';

@Service()
@Controller('api/user')
export class UserController {
  private className = 'UserController';
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async listUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listUser', `RQ`, { req: req });

    try {
      const users: User[] = await this.userService.getCustomerUsers();
      users.forEach((user) => {
        user.pwd = '';
      });

      res.status(200).json({ data: users });
    } catch (e) {
      next(e);
    }
  }

  @Get(':id')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getUser', `RQ`, { req: req });

    try {
      const username: string = req.params.id;
      const user: User = await this.userService.findById(username);
      if (!user) {
        throw new NotFoundException(username);
      }
      user.pwd = '';

      res.status(200).json({ data: user });
    } catch (e) {
      next(e);
    }
  }

  @Post()
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async addUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'addUser', `RQ`, { req: req });

    try {
      const userBody: User = <User>req.body;
      const user: User = await this.userService.findById(userBody.usr);
      if (user) {
        throw new ExistedException(userBody.usr);
      }
      const newUser: User = await this.userService.store(userBody);
      userBody.pwd = '';

      res.status(200).json({ data: newUser });
    } catch (e) {
      next(e);
    }
  }

  @Put()
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateUser', `RQ`, { req: req });

    try {
      const userBody: User = <User>req.body;
      const user: User = await this.userService.findById(userBody.usr);
      if (!user) {
        throw new NotFoundException(userBody.usr);
      }
      const newUser: User = await this.userService.update(userBody.usr, userBody);
      newUser.pwd = '';

      res.status(200).json({ data: newUser });
    } catch (e) {
      next(e);
    }
  }

  @Delete(':id')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'deleteUser', 'RQ', { req: req });

    try {
      const username: string = req.params.id;
      const user: User = await this.userService.findById(username);
      if (user) {
        throw new NotFoundException(username);
      }
      await this.userService.delete(username);
      user.pwd = '';

      res.status(200).json({ data: user });
    } catch (e) {
      next(e);
    }
  }
}
