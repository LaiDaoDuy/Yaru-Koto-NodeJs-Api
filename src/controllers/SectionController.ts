import { Service } from 'typedi';
import { Controller, Get, Post, Put, Delete } from '@overnightjs/core';
import { NextFunction, Request, Response } from 'express';
import Log from '../utils/Log';
import { SectionService } from '../services/SectionService';
import { Section } from '../bo/entities/Section';
import { ExistedException } from '../exceptions/ExistedException';
import { Project } from '../bo/entities/Project';
import { ProjectService } from '../services/ProjectService';
import { NotFoundException } from '../exceptions/NotFoundException';

@Service()
@Controller('api/section')
export class SectionController {
  private className = 'SectionController';
  constructor(private readonly sectionService: SectionService, private readonly projectService: ProjectService) {}

  @Get()
  public async listSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listSection', 'RQ', { req: req });

    try {
      const sections: Section[] = await this.sectionService.index();

      res.status(200).json({ data: sections });
    } catch (e) {
      next(e);
    }
  }

  @Post(':projectId')
  public async addSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'addSection', 'RQ', { req: req });

    try {
      const sectionBody: Section = req.body;
      const projectId: number = Number.parseInt(req.params.projectId);

      const sectionDb: Section = await this.sectionService.findByName(sectionBody.name);
      if (sectionDb) {
        throw new ExistedException(sectionBody.name);
      }
      const projectDb: Project = await this.projectService.findById(projectId);
      if (!projectDb) {
        throw new NotFoundException(projectId);
      }
      sectionBody.project = projectDb;
      const newSection: Section = await this.sectionService.store(sectionBody);

      res.status(200).json({ data: newSection });
    } catch (e) {
      next(e);
    }
  }

  @Get(':sectionId')
  public async getSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getSection', 'RQ', { req: req });

    try {
      const sectionId: number = Number.parseInt(req.params.sectionId);
      const section: Section = await this.sectionService.findById(sectionId, {
        relations: ['tasks']
      });
      if (!section) {
        throw new NotFoundException(sectionId);
      }

      res.status(200).json({ data: section });
    } catch (e) {
      next(e);
    }
  }

  @Put(':sectionId')
  public async updateSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateSection', 'RQ', { req: req });

    try {
      const sectionBody: Section = req.body;
      const sectionId: number = Number.parseInt(req.params.sectionId);
      const sectionDb: Section = await this.sectionService.findById(sectionId);
      if (!sectionDb) {
        throw new NotFoundException(sectionId);
      }
      const sectionDb2: Section = await this.sectionService.findByName(sectionBody.name);
      if (sectionDb2) {
        throw new ExistedException(sectionBody.name);
      }
      const newSection: Section = await this.sectionService.update(sectionId, sectionBody);

      res.status(200).json({ data: newSection });
    } catch (e) {
      next(e);
    }
  }

  @Delete(':sectionId')
  public async deleteSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'deleteSection', 'RQ', { req: req });

    try {
      const sectionId: number = Number.parseInt(req.params.sectionId);
      const sectionDb: Section = await this.sectionService.findById(sectionId);
      if (!sectionDb) {
        throw new NotFoundException(sectionId);
      }
      await this.sectionService.delete(sectionId);

      res.status(200).json({ data: sectionDb });
    } catch (e) {
      next(e);
    }
  }
}
