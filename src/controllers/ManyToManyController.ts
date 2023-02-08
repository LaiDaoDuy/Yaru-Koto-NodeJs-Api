import { NextFunction, Request, Response } from 'express';
import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { QuestionService, CategoryService } from '../services/many2many/index';
import { Question, Category } from '../bo/entities/many2many/index';
import { Service } from 'typedi';
import Log from '../utils/Log';
import { NotFoundException } from '../exceptions/NotFoundException';

@Service()
@Controller('api/many2many')
export class ManyToManyController {
  private className = 'ManyToManyController';
  constructor(private readonly questionService: QuestionService, private readonly categoryService: CategoryService) {}

  @Get()
  private async listMany2Many(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listMany2Many', 'RQ', { req: req });

    try {
      const questions: Question[] = await this.questionService.index({ relations: ['categories'] });

      res.status(200).json({ data: questions });
    } catch (e) {
      next(e);
    }
  }

  @Post()
  private async addMany2Many(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'addMany2Many', `RQ`, { req: req });

    try {
      const questionBody: Question = req.body;
      const categoriesBody: Category[] = questionBody.categories;
      for (let i = 0; i < categoriesBody.length; i++) {
        let category: Category = await this.categoryService.findByName(categoriesBody[i].name);
        if (!category) {
          category = await this.categoryService.store(categoriesBody[i]);
        }
        categoriesBody[i] = category;
      }
      const newQuestion: Question = await this.questionService.store(questionBody);

      res.status(200).json({ data: newQuestion });
    } catch (e) {
      next(e);
    }
  }

  @Get(':questionId')
  private async getMany2Many(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getMany2Many', 'RQ', { req: req });

    try {
      const questionId: number = parseInt(req.params.questionId);
      const question: Question = await this.questionService.findById(questionId, {
        relations: ['categories']
      });
      if (!question) {
        throw new NotFoundException(questionId);
      }

      res.status(200).json({ data: question });
    } catch (e) {
      next(e);
    }
  }

  @Get('question/all')
  private async getQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getQuestions', 'RQ', { req: req });

    try {
      const questions: Question[] = await this.questionService.index();

      res.status(200).json({ data: questions });
    } catch (e) {
      next(e);
    }
  }

  @Get('category/all')
  private async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getCategories', 'RQ', { req: req });

    try {
      const categories: Category[] = await this.categoryService.index();

      res.status(200).json({ data: categories });
    } catch (e) {
      next(e);
    }
  }

  @Put('question')
  private async updateQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateQuestion', 'RQ', { req: req });

    try {
      const questionBody: Question = req.body;
      const questionDb: Question = await this.questionService.findById(questionBody.id);
      if (!questionDb) {
        throw new NotFoundException(questionBody.id);
      }

      const categoriesBody: Category[] = questionBody.categories;

      for (let i = 0; i < categoriesBody.length; i++) {
        let category = await this.categoryService.findByName(categoriesBody[i].name);
        if (!category) {
          category = await this.categoryService.store(categoriesBody[i]);
        }
        categoriesBody[i] = category;
      }
      const newQuestion: Question = await this.questionService.update(questionBody.id, questionBody, {
        relations: ['categories']
      });

      res.status(200).json({ data: newQuestion });
    } catch (e) {
      next(e);
    }
  }

  @Put('category')
  private async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateCategory', 'RQ', { req: req });

    try {
      const categoryBody: Category = req.body;
      const categoryDb: Category = await this.categoryService.findById(categoryBody.id);
      if (!categoryDb) {
        throw new NotFoundException(categoryBody.id);
      }
      const newCategory: Category = await this.categoryService.update(categoryBody.id, categoryBody);

      res.status(200).json({ data: newCategory });
    } catch (e) {
      next(e);
    }
  }

  @Delete('question/:questionId')
  private async deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'deleteQuestion', 'RQ', { req: req });

    try {
      const questionId: number = parseInt(req.params.questionId);
      const question: Question = await this.questionService.findById(questionId);
      if (!question) {
        throw new NotFoundException(questionId);
      }
      await this.questionService.delete(questionId);

      res.status(200).json({ data: question });
    } catch (e) {
      next(e);
    }
  }

  @Delete('category/:categoryId')
  private async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'deleteCategory', `RQ`, { req: req });

    try {
      const categoryId: number = Number.parseInt(req.params.categoryId, 10);
      const category: Category = await this.categoryService.findById(categoryId);
      if (!category) {
        throw new NotFoundException(req.params.id);
      }
      await this.categoryService.delete(categoryId);

      res.status(200).json({ data: category });
    } catch (e) {
      next(e);
    }
  }
}
