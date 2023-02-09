import { EntityRepository, Repository } from 'typeorm';
import { User } from '../bo/entities/User';
import { Service } from 'typedi';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {}
