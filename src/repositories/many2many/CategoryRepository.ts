import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../../bo/entities/many2many/Category';
import { Service } from 'typedi';

@Service()
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  findByName(name: string): Promise<Category> {
    return this.createQueryBuilder().where(`name=:name`, { name: name }).getOne();
  }
}
