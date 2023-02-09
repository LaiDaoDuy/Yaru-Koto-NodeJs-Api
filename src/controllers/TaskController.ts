import { Service } from 'typedi';
import { Controller, Get, Post } from '@overnightjs/core';
import { TaskService } from '../services';
import { NextFunction, Request, Response } from 'express';
import Log from '../utils/Log';
import { Task } from '../bo/entities/Task';
import { Section } from '../bo/entities/Section';
import { SectionService } from '../services/SectionService';
import { NotFoundException } from '../exceptions/NotFoundException';

@Service()
@Controller('api/task')
export class TaskController {
  private className = 'TaskController';
  constructor(private readonly taskService: TaskService, private readonly sectionService: SectionService) {}

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

  @Post(':sectionId')
  public async addTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'addTask', 'RQ', { req: req });

    try {
      const taskBody: Task = req.body;
      const sectionId: number = Number.parseInt(req.params.sectionId);

      const sectionDb: Section = await this.sectionService.findById(sectionId);
      if (!sectionDb) {
        throw new NotFoundException(sectionId);
      }
      taskBody.section = sectionDb;
      const newTask: Task = await this.taskService.store(taskBody);

      res.status(200).json({ data: newTask });
    } catch (e) {
      next(e);
    }
  }
}
