import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './Task';
import { Project } from './Project';

@Entity({ name: 'sections' })
export class Section extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    length: 150
  })
  name: string;

  @OneToMany(() => Task, (task) => task.section, {
    cascade: ['remove']
  })
  tasks: Task[];

  @ManyToOne(() => Project, (project) => project.sections, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'project_id',
    referencedColumnName: 'id'
  })
  project: Project;
}
