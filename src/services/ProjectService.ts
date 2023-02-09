import { Service } from 'typedi';
import { BaseService } from './BaseService';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Project } from '../bo/entities/Project';
import { ProjectRepository } from '../repositories/ProjectRepository';

@Service()
export class ProjectService extends BaseService<Project, ProjectRepository> {
  constructor(@InjectRepository(Project) repository: ProjectRepository) {
    super(repository);
  }

  findByName(name: string): Promise<Project> {
    return this.repository.findByName(name);
  }
}
