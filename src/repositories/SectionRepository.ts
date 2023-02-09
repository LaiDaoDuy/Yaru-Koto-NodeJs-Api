import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { Section } from '../bo/entities/Section';

@Service()
@EntityRepository(Section)
export class SectionRepository extends Repository<Section> {
  findByName(name: string): Promise<Section> {
    return this.createQueryBuilder().where('name=:name', { name: name }).getOne();
  }
}
