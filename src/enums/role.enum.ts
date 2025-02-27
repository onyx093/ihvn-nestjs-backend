import {
  mapEnumToObjects,
  mapSpecifiedEnumMembersToObjects,
} from '../lib/util';
import { RoleActions, RoleSubject } from '../roles/actions/roles.action';
import { UserActions, UserSubject } from '../users/actions/users.action';

export enum PredefinedRoles {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  RECEPTIONIST = 'Receptionist',
  STUDENT = 'Student',
  GUEST = 'Guest',
}

export const SuperAdmin = {
  roleName: PredefinedRoles.SUPER_ADMIN,
  permissions: [
    ...mapEnumToObjects(UserActions, UserSubject),
    ...mapEnumToObjects(RoleActions, RoleSubject),
  ],
};

export const Admin = {
  roleName: PredefinedRoles.ADMIN,
  permissions: [
    ...mapEnumToObjects(UserActions, UserSubject),
    ...mapEnumToObjects(RoleActions, RoleSubject),
  ],
};

export const Editor = {
  roleName: PredefinedRoles.EDITOR,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
    ]),
  ],
};

export const Receptionist = {
  roleName: PredefinedRoles.RECEPTIONIST,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_USERS',
      'READ_ONE_USERS',
      'READ_SELF_USERS',
      'UPDATE_USERS',
      'CREATE_USERS',
    ]),
  ],
};

export const Student = {
  roleName: PredefinedRoles.STUDENT,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
    ]),
  ],
};

export const Guest = {
  roleName: PredefinedRoles.GUEST,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
    ]),
  ],
};
