import { Service } from 'typedi';
import { Controller, Get, Post, Put, Delete } from '@overnightjs/core';
import { NextFunction, Request, Response } from 'express';
import Log from '../utils/Log';
import { ProjectService } from '../services/ProjectService';
import { Project } from '../bo/entities/Project';
import { ExistedException } from '../exceptions/ExistedException';
import { NotFoundException } from '../exceptions/NotFoundException';

@Service()
@Controller('api/project')
export class ProjectController {
  private className = 'ProjectController';
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  public async listProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listProject', 'RQ', { req: req });

    try {
      const projects: Project[] = await this.projectService.index();

      res.status(200).json({ data: projects });
    } catch (e) {
      next(e);
    }
  }

  @Post()
  public async addProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'addProject', 'RQ', { req: req });

    try {
      const projectBody: Project = req.body;
      const projectDb: Project = await this.projectService.findByName(projectBody.name);
      if (projectDb) {
        throw new ExistedException(projectBody.name);
      }
      const newProject: Project = await this.projectService.store(projectBody);

      res.status(200).json({ data: newProject });
    } catch (e) {
      next(e);
    }
  }

  @Get(':projectId')
  public async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getProject', 'RQ', { req: req });

    try {
      const projectId: number = Number.parseInt(req.params.projectId);
      const project: Project = await this.projectService.findById(projectId, {
        relations: ['sections']
      });
      if (!project) {
        throw new NotFoundException(projectId);
      }

      res.status(200).json({ data: project });
    } catch (e) {
      next(e);
    }
  }

  @Put(':projectId')
  public async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateProject', 'RQ', { req: req });

    try {
      const projectBody: Project = req.body;
      const projectId: number = Number.parseInt(req.params.projectId);
      const projectDb: Project = await this.projectService.findById(projectId);
      if (!projectDb) {
        throw new NotFoundException(projectId);
      }
      const projectDb2: Project = await this.projectService.findByName(projectBody.name);
      if (projectDb2) {
        throw new ExistedException(projectBody.name);
      }
      const newProject: Project = await this.projectService.update(projectId, projectBody);

      res.status(200).json({ data: newProject });
    } catch (e) {
      next(e);
    }
  }

  @Delete(':projectId')
  public async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'deleteProject', 'RQ', { req: req });

    try {
      const projectId: number = Number.parseInt(req.params.projectId);
      const projectDb: Project = await this.projectService.findById(projectId);
      if (!projectDb) {
        throw new NotFoundException(projectId);
      }
      await this.projectService.delete(projectId);

      res.status(200).json({ data: projectDb });
    } catch (e) {
      next(e);
    }
  }
}
