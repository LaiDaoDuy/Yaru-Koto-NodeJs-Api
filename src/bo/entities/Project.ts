import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Section } from './Section';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    length: 150
  })
  name: string;

  @Column({
    default: '0'
  })
  favorite: boolean;

  @OneToMany(() => Section, (section) => section.id)
  section: Section[];
}
