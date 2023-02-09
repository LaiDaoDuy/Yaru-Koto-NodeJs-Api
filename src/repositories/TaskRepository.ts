import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../bo/entities/Task';

@Service()
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}
