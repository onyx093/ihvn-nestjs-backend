import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity<T> {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
