import { EventActions, EventSubject } from '../events/actions/events.action';
import {
  CourseActions,
  CourseSubject,
} from '../courses/actions/courses.actions';
import {
  mapEnumToObjects,
  mapSpecifiedEnumMembersToObjects,
} from '../lib/util';
import { RoleActions, RoleSubject } from '../roles/actions/roles.action';
import { UserActions, UserSubject } from '../users/actions/users.action';
import {
  PermissionActions,
  PermissionSubject,
} from '../permissions/actions/permissions.action';
import {
  AttendanceActions,
  AttendanceSubject,
} from '../attendance/actions/attendance.action';

export enum RoleType {
  PREDEFINED = 'predefined',
  CUSTOM = 'custom',
}

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
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapEnumToObjects(UserActions, UserSubject),
    ...mapEnumToObjects(RoleActions, RoleSubject),
    ...mapEnumToObjects(PermissionActions, PermissionSubject),
    ...mapEnumToObjects(CourseActions, CourseSubject),
    ...mapEnumToObjects(EventActions, EventSubject),
    ...mapEnumToObjects(AttendanceActions, AttendanceSubject),
  ],
};

export const Admin = {
  roleName: PredefinedRoles.ADMIN,
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapEnumToObjects(UserActions, UserSubject),
    ...mapEnumToObjects(RoleActions, RoleSubject),
    ...mapEnumToObjects(CourseActions, CourseSubject),
    ...mapEnumToObjects(EventActions, EventSubject),
    ...mapEnumToObjects(AttendanceActions, AttendanceSubject),
  ],
};

export const Editor = {
  roleName: PredefinedRoles.EDITOR,
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
    ]),
    ...mapEnumToObjects(CourseActions, CourseSubject),
    ...mapSpecifiedEnumMembersToObjects(EventActions, EventSubject, [
      'READ_EVENTS',
      'READ_ONE_EVENTS',
      'CREATE_EVENTS',
      'UPDATE_EVENTS',
    ]),
  ],
};

export const Receptionist = {
  roleName: PredefinedRoles.RECEPTIONIST,
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_USERS',
      'READ_ONE_USERS',
      'READ_SELF_USERS',
      'UPDATE_USERS',
      'CREATE_USERS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CourseActions, CourseSubject, [
      'READ_COURSES',
      'READ_ONE_COURSES',
    ]),
    ...mapSpecifiedEnumMembersToObjects(EventActions, EventSubject, [
      'READ_EVENTS',
      'READ_ONE_EVENTS',
    ]),
    ...mapEnumToObjects(AttendanceActions, AttendanceSubject),
  ],
};

export const Student = {
  roleName: PredefinedRoles.STUDENT,
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CourseActions, CourseSubject, [
      'READ_COURSES',
      'READ_ONE_COURSES',
    ]),
    ...mapSpecifiedEnumMembersToObjects(EventActions, EventSubject, [
      'READ_EVENTS',
      'READ_ONE_EVENTS',
    ]),
  ],
};

export const Guest = {
  roleName: PredefinedRoles.GUEST,
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CourseActions, CourseSubject, [
      'READ_COURSES',
      'READ_ONE_COURSES',
    ]),
    ...mapSpecifiedEnumMembersToObjects(EventActions, EventSubject, [
      'READ_EVENTS',
      'READ_ONE_EVENTS',
    ]),
  ],
};
