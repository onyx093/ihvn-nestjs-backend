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
import {
  CohortActions,
  CohortSubject,
} from '../cohorts/actions/cohort.actions';
import {
  CourseScheduleActions,
  CourseScheduleSubject,
} from '../course-schedules/actions/course-schedules.actions';
import {
  CohortCourseActions,
  CohortCourseSubject,
} from '../cohort-courses/actions/cohort-courses.actions';
import {
  InstructorActions,
  InstructorSubject,
} from '../instructors/actions/instructors.actions';
import { LessonActions, LessonSubject } from '../lesson/actions/lesson.actions';
import {
  EnrollmentActions,
  EnrollmentSubject,
} from '../enrollments/actions/enrollments.actions';
import { map } from 'rxjs';

export enum RoleType {
  PREDEFINED = 'predefined',
  CUSTOM = 'custom',
}

export enum PredefinedRoles {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  INSTRUCTOR = 'Instructor',
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
    ...mapEnumToObjects(CourseActions, CourseSubject),
    ...mapEnumToObjects(EventActions, EventSubject),
    ...mapEnumToObjects(AttendanceActions, AttendanceSubject),
    ...mapEnumToObjects(CohortActions, CohortSubject),
    ...mapEnumToObjects(CourseScheduleActions, CourseScheduleSubject),
    ...mapEnumToObjects(CohortCourseActions, CohortCourseSubject),
    ...mapEnumToObjects(InstructorActions, InstructorSubject),
    ...mapEnumToObjects(LessonActions, LessonSubject),
    ...mapEnumToObjects(EnrollmentActions, EnrollmentSubject),
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
    ...mapEnumToObjects(CohortActions, CohortSubject),
    ...mapEnumToObjects(CourseScheduleActions, CourseScheduleSubject),
    ...mapEnumToObjects(CohortCourseActions, CohortCourseSubject),
    ...mapEnumToObjects(InstructorActions, InstructorSubject),
    ...mapEnumToObjects(LessonActions, LessonSubject),
    ...mapEnumToObjects(EnrollmentActions, EnrollmentSubject),
  ],
};

export const Editor = {
  roleName: PredefinedRoles.EDITOR,
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
      'UPDATE_SELF_PASSWORD_ON_FIRST_LOGIN',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CourseActions, CourseSubject, [
      'READ_COURSES',
      'READ_ONE_COURSES',
      'CREATE_COURSES',
      'UPDATE_COURSES',
    ]),
    ...mapSpecifiedEnumMembersToObjects(EventActions, EventSubject, [
      'READ_EVENTS',
      'READ_ONE_EVENTS',
      'CREATE_EVENTS',
      'UPDATE_EVENTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CohortActions, CohortSubject, [
      'READ_COHORTS',
      'READ_ONE_COHORTS',
      'UPDATE_COHORTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(
      CourseScheduleActions,
      CourseScheduleSubject,
      [
        'READ_COURSE_SCHEDULES',
        'READ_ONE_COURSE_SCHEDULES',
        'UPDATE_COURSE_SCHEDULES',
      ]
    ),
    ...mapSpecifiedEnumMembersToObjects(
      CohortCourseActions,
      CohortCourseSubject,
      ['READ_ACTIVE_COURSES_FOR_COHORT']
    ),
    ...mapSpecifiedEnumMembersToObjects(InstructorActions, InstructorSubject, [
      'READ_INSTRUCTORS',
      'READ_ONE_INSTRUCTORS',
    ]),
  ],
};

export const Instructor = {
  roleName: PredefinedRoles.INSTRUCTOR,
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
      'UPDATE_SELF_PASSWORD_ON_FIRST_LOGIN',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CourseActions, CourseSubject, [
      'READ_COURSES',
      'READ_ONE_COURSES',
      'SEARCH_COURSES',
    ]),
    ...mapSpecifiedEnumMembersToObjects(EventActions, EventSubject, [
      'READ_EVENTS',
      'READ_ONE_EVENTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CohortActions, CohortSubject, [
      'READ_COHORTS',
      'READ_ONE_COHORTS',
      'READ_ACTIVE_COHORTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(
      CourseScheduleActions,
      CourseScheduleSubject,
      ['READ_COURSE_SCHEDULES', 'READ_ONE_COURSE_SCHEDULES']
    ),
    ...mapSpecifiedEnumMembersToObjects(
      CohortCourseActions,
      CohortCourseSubject,
      ['READ_ACTIVE_COURSES_FOR_COHORT']
    ),
    ...mapSpecifiedEnumMembersToObjects(InstructorActions, InstructorSubject, [
      'READ_INSTRUCTORS',
      'READ_ONE_INSTRUCTORS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(LessonActions, LessonSubject, [
      'READ_LESSONS',
      'READ_ONE_LESSONS',
      'MARK_LESSON_AS_COMPLETED',
    ]),
    ...mapSpecifiedEnumMembersToObjects(EnrollmentActions, EnrollmentSubject, [
      'READ_ENROLLMENTS',
      'READ_ONE_ENROLLMENTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(AttendanceActions, AttendanceSubject, [
      'CONFIRM_ATTENDANCE',
      'CREATE_ATTENDANCE',
      'GET_ATTENDANCE_LIST_FOR_LESSON',
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
      'UPDATE_SELF_PASSWORD_ON_FIRST_LOGIN',
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
    ...mapSpecifiedEnumMembersToObjects(CohortActions, CohortSubject, [
      'READ_COHORTS',
      'READ_ONE_COHORTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(
      CourseScheduleActions,
      CourseScheduleSubject,
      ['READ_COURSE_SCHEDULES', 'READ_ONE_COURSE_SCHEDULES']
    ),
    ...mapSpecifiedEnumMembersToObjects(InstructorActions, InstructorSubject, [
      'READ_INSTRUCTORS',
      'READ_ONE_INSTRUCTORS',
    ]),
  ],
};

export const Student = {
  roleName: PredefinedRoles.STUDENT,
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
      'UPDATE_SELF_PASSWORD_ON_FIRST_LOGIN',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CourseActions, CourseSubject, [
      'READ_COURSES',
      'READ_ONE_COURSES',
      'ENROLL_COURSES',
      'UNENROLL_COURSES',
      'SEARCH_COURSES',
    ]),
    ...mapSpecifiedEnumMembersToObjects(EventActions, EventSubject, [
      'READ_EVENTS',
      'READ_ONE_EVENTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CohortActions, CohortSubject, [
      'READ_COHORTS',
      'READ_ONE_COHORTS',
      'READ_ACTIVE_COHORTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(
      CourseScheduleActions,
      CourseScheduleSubject,
      ['READ_COURSE_SCHEDULES', 'READ_ONE_COURSE_SCHEDULES']
    ),
    ...mapSpecifiedEnumMembersToObjects(
      CohortCourseActions,
      CohortCourseSubject,
      ['READ_ACTIVE_COURSES_FOR_COHORT']
    ),
    ...mapSpecifiedEnumMembersToObjects(InstructorActions, InstructorSubject, [
      'READ_INSTRUCTORS',
      'READ_ONE_INSTRUCTORS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(LessonActions, LessonSubject, [
      'READ_LESSONS',
      'READ_ONE_LESSONS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(AttendanceActions, AttendanceSubject, [
      'MARK_ATTENDANCE',
    ]),
  ],
};

export const Guest = {
  roleName: PredefinedRoles.GUEST,
  type: RoleType.PREDEFINED,
  permissions: [
    ...mapSpecifiedEnumMembersToObjects(UserActions, UserSubject, [
      'READ_SELF_USERS',
      'UPDATE_SELF_PASSWORD_ON_FIRST_LOGIN',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CourseActions, CourseSubject, [
      'READ_COURSES',
      'READ_ONE_COURSES',
    ]),
    ...mapSpecifiedEnumMembersToObjects(EventActions, EventSubject, [
      'READ_EVENTS',
      'READ_ONE_EVENTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(CohortActions, CohortSubject, [
      'READ_COHORTS',
      'READ_ONE_COHORTS',
    ]),
    ...mapSpecifiedEnumMembersToObjects(
      CourseScheduleActions,
      CourseScheduleSubject,
      ['READ_COURSE_SCHEDULES', 'READ_ONE_COURSE_SCHEDULES']
    ),
    ...mapSpecifiedEnumMembersToObjects(
      CohortCourseActions,
      CohortCourseSubject,
      ['READ_ACTIVE_COURSES_FOR_COHORT']
    ),
    ...mapSpecifiedEnumMembersToObjects(InstructorActions, InstructorSubject, [
      'READ_INSTRUCTORS',
      'READ_ONE_INSTRUCTORS',
    ]),
  ],
};
