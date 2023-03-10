import { Service } from 'typedi';
import { Controller, Get, Post, Put, Delete } from '@overnightjs/core';
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
  public async listTaskBySectionId(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listTaskBySectionId', 'RQ', { req: req });

    try {
      const sectionId: number = parseInt(req.query.section_id as string);
      const sectionDb: Section = await this.sectionService.findById(sectionId, {
        relations: ['tasks']
      });
      if (!sectionDb) {
        throw new NotFoundException(sectionId);
      }

      res.status(200).json({ data: sectionDb.tasks });
    } catch (e) {
      next(e);
    }
  }

  @Post()
  public async addTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'addTask', 'RQ', { req: req });

    try {
      const taskBody: Task = req.body;
      const sectionId: number = Number.parseInt(req.query.section_id as string);

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

  @Get(':taskId')
  public async getTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getTask', 'RQ', { req: req });

    try {
      const taskId: number = Number.parseInt(req.params.taskId);
      const task: Task = await this.taskService.findById(taskId);
      if (!task) {
        throw new NotFoundException(taskId);
      }

      res.status(200).json({ data: task });
    } catch (e) {
      next(e);
    }
  }

  @Put(':taskId')
  public async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateTask', 'RQ', { req: req });

    try {
      const taskBody: Task = req.body;
      const taskId: number = Number.parseInt(req.params.taskId);
      const taskDb: Task = await this.taskService.findById(taskId);
      if (!taskDb) {
        throw new NotFoundException(taskId);
      }
      const newSection: Task = await this.taskService.update(taskId, taskBody);

      res.status(200).json({ data: newSection });
    } catch (e) {
      next(e);
    }
  }

  @Delete(':taskId')
  public async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'deleteTask', 'RQ', { req: req });

    try {
      const taskId: number = Number.parseInt(req.params.taskId);
      const taskDb: Task = await this.taskService.findById(taskId);
      if (!taskDb) {
        throw new NotFoundException(taskId);
      }
      await this.taskService.delete(taskId);

      res.status(200).json({ data: taskDb });
    } catch (e) {
      next(e);
    }
  }
}
