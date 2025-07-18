import { type Lesson } from '@/lesson/entities/lesson.entity';

export type LessonWithAttendanceCounts = Lesson & {
  presentCount: number;
  absentCount: number;
};
