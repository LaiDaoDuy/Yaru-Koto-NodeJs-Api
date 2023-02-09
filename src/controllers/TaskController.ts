import { Service } from 'typedi';
import { Controller, Get, Post } from '@overnightjs/core';
import { TaskService } from '../services';
import { NextFunction, Request, Response } from 'express';
import Log from '../utils/Log';
import { Task } from '../bo/entities/Task';

@Service()
@Controller('api/task')
export class TaskController {
  private className = 'TaskController';
  constructor(private readonly taskService: TaskService) {}

  @Get()
  public async listTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listTask', 'RQ', { req: req });

    try {
      const task: Task[] = await this.taskService.index();

      res.status(200).json({ data: task });
    } catch (e) {
      next(e);
    }
  }

  @Post()
  public async addTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'addTask', 'RQ', { req: req });

    try {
      const taskBody: Task = req.body;
      const newTask: Task = await this.taskService.store(taskBody);

      res.status(200).json({ data: newTask });
    } catch (e) {
      next(e);
    }
  }
}
