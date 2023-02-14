import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Section } from './Section';

@Entity({ name: 'tasks' })
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  description: string;

  @Column({
    default: '0'
  })
  completed: boolean;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  createAt: {};

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updateAt: string;

  @Column({
    name: 'due_time',
    type: 'timestamp'
  })
  dueTime: string;

  @ManyToOne(() => Section, (section) => section.tasks, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'section_id',
    referencedColumnName: 'id'
  })
  section: Section;
}
