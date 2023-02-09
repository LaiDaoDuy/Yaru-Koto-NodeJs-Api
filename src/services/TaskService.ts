import { Service } from 'typedi';
import { BaseService } from './BaseService';
import { Task } from '../bo/entities/Task';
import { TaskRepository } from '../repositories';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class TaskService extends BaseService<Task, TaskRepository> {
  constructor(@InjectRepository(Task) repository: TaskRepository) {
    super(repository);
  }
}
