import e, { NextFunction, Request, Response } from 'express';
import { Controller, Post, Get, Delete, Put } from '@overnightjs/core';
import { CustomerProfileService, CustomerService } from '../services/one2one/index';
import { Customer } from '../bo/entities/one2one/index';
import { Service } from 'typedi';
import Log from '../utils/Log';
import { NotFoundException } from '../exceptions/NotFoundException';
import { ExistedException } from '../exceptions/ExistedException';
import { EmailNotCorrectException } from '../exceptions/EmailNotCorrectException';

@Service()
@Controller('api/one2one')
export class OneToOneController {
  private className = 'OneToOneController';
  constructor(private readonly customerProfileService: CustomerProfileService, private readonly customerService: CustomerService) {}

  @Get()
  private async listOne2One(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listOne2One', 'RQ', { req: req });

    try {
      const customers: Customer[] = await this.customerService.index({
        relations: ['profile']
      });

      res.status(200).json({ data: customers });
    } catch (e) {
      next(e);
    }
  }

  @Post()
  private async addOne2One(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'addOne2One', `RQ`, { req: req });

    try {
      const customerBody: Customer = req.body;
      if (customerBody.email !== customerBody.profile.email) {
        throw new EmailNotCorrectException();
      }
      const customerDb = await this.customerService.findById(customerBody.email);
      if (customerDb) {
        throw new ExistedException(customerBody.email);
      }
      const newCustomer: Customer = await this.customerService.store(customerBody);

      res.status(200).json({ data: newCustomer });
    } catch (e) {
      next(e);
    }
  }

  @Get(':email')
  private async getOne2One(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getOne2One', 'RQ', { req: req });

    try {
      const email: string = req.params.email;
      const customer: Customer = await this.customerService.findById(email, { relations: ['profile'] });
      if (!customer) {
        throw new NotFoundException(email);
      }

      res.status(200).json({ data: customer });
    } catch (e) {
      next(e);
    }
  }

  @Delete(':email')
  private async deleteOne2One(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'deleteOne2One', 'RQ', { req: req });

    try {
      const email: string = req.params.email;
      const customer = await this.customerService.findById(email, { relations: ['profile'] });
      if (!customer) {
        throw new NotFoundException(email);
      }
      await this.customerService.delete(email);
      await this.customerProfileService.delete(email);

      res.status(200).json({ data: customer });
    } catch (e) {
      next(e);
    }
  }

  @Put()
  private async updateOne2One(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateOne2One', 'RQ', { req: req });

    try {
      const customerBody: Customer = req.body;
      if (customerBody.email !== customerBody.profile.email) {
        throw new EmailNotCorrectException();
      }
      const customerDb: Customer = await this.customerService.findById(customerBody.email);
      if (!customerDb) {
        throw new NotFoundException(customerBody.email);
      }
      await this.customerService.update(customerBody.email, customerBody);
      await this.customerProfileService.update(customerBody.email, customerBody.profile);

      res.status(200).json({ data: customerBody });
    } catch (e) {
      next(e);
    }
  }
}
