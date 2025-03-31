import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'events' })
export class Event extends AbstractEntity<Event> {
  @Column()
  title: string;

  @Column()
  slug: string;
}
