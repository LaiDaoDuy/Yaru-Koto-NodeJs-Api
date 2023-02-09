import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { Project } from '../bo/entities/Project';

@Service()
@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  findByName(name: string): Promise<Project> {
    return this.createQueryBuilder().where('name=:name', { name: name }).getOne();
  }
}
