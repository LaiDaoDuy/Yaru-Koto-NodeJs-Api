import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Section } from './Section';

@Entity({ name: 'tasks' })
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'section_id',
    nullable: false
  })
  sectionId: number;

  @Column()
  content: string;

  @Column()
  description: string;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  createAt: string;

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
}
