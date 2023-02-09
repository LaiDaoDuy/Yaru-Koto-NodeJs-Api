import { Service } from 'typedi';
import { BaseService } from './BaseService';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Section } from '../bo/entities/Section';
import { SectionRepository } from '../repositories/SectionRepository';

@Service()
export class SectionService extends BaseService<Section, SectionRepository> {
  constructor(@InjectRepository(Section) repository: SectionRepository) {
    super(repository);
  }

  findByName(name: string): Promise<Section> {
    return this.repository.findByName(name);
  }
}
