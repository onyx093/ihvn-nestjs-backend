import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Role } from '@/roles/entities/role.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission extends AbstractEntity<Permission> {
  @Column({ unique: true })
  name: string; // value from the permission decorator

  @Column()
  subject: string; // value from the subject decorator

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
