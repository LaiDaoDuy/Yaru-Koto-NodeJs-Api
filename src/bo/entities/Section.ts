import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Task } from './Task';

@Entity({ name: 'sections' })
export class Section extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'project_id',
    nullable: false
  })
  projectId: number;

  @Column({
    nullable: false,
    length: 150
  })
  name: string;

  @OneToMany(() => Task, (task) => task.id)
  task: Task[];
}
