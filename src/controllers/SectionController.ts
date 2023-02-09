import { Service } from 'typedi';
import { Controller, Get, Post } from '@overnightjs/core';
import { NextFunction, Request, Response } from 'express';
import Log from '../utils/Log';
import { SectionService } from '../services/SectionService';
import { Section } from '../bo/entities/Section';
import { ExistedException } from '../exceptions/ExistedException';

@Service()
@Controller('api/section')
export class SectionController {
  private className = 'SectionController';
  constructor(private readonly sectionService: SectionService) {}

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

  @Post()
  public async addSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'addSection', 'RQ', { req: req });

    try {
      const sectionBody: Section = req.body;
      const sectionDb: Section = await this.sectionService.findByName(sectionBody.name);
      if (sectionDb) {
        throw new ExistedException(sectionBody.name);
      }
      const newSection: Section = await this.sectionService.store(sectionBody);

      res.status(200).json({ data: newSection });
    } catch (e) {
      next(e);
    }
  }
}
