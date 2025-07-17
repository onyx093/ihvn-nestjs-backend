import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddDeleteColumn1752759525275 implements MigrationInterface {
    name = 'UserAddDeleteColumn1752759525275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "deletedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "user_settings"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.515Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "user_settings"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.515Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "accounts"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.565Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "accounts"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.565Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "cohort_courses"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.605Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "cohort_courses"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.605Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "cohorts"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.606Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "cohorts"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.606Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ALTER COLUMN "enrolledAt"
            SET DEFAULT '"2025-07-17T13:38:46.606Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.606Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.606Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.606Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.606Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "instructors"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.609Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "instructors"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.609Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "course_schedules"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.616Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "course_schedules"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.616Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.616Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.616Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "createdAt"
            SET DEFAULT '"2025-07-17T13:38:46.624Z"'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '"2025-07-17T13:38:46.624Z"'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.889'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.889'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.882'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.882'
        `);
        await queryRunner.query(`
            ALTER TABLE "course_schedules"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.882'
        `);
        await queryRunner.query(`
            ALTER TABLE "course_schedules"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.882'
        `);
        await queryRunner.query(`
            ALTER TABLE "instructors"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.86'
        `);
        await queryRunner.query(`
            ALTER TABLE "instructors"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.86'
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.889'
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.889'
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.874'
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.874'
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ALTER COLUMN "enrolledAt"
            SET DEFAULT '2025-07-17 12:10:41.874'
        `);
        await queryRunner.query(`
            ALTER TABLE "cohorts"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.874'
        `);
        await queryRunner.query(`
            ALTER TABLE "cohorts"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.874'
        `);
        await queryRunner.query(`
            ALTER TABLE "cohort_courses"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.874'
        `);
        await queryRunner.query(`
            ALTER TABLE "cohort_courses"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.874'
        `);
        await queryRunner.query(`
            ALTER TABLE "accounts"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.84'
        `);
        await queryRunner.query(`
            ALTER TABLE "accounts"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.84'
        `);
        await queryRunner.query(`
            ALTER TABLE "user_settings"
            ALTER COLUMN "updatedAt"
            SET DEFAULT '2025-07-17 12:10:41.789'
        `);
        await queryRunner.query(`
            ALTER TABLE "user_settings"
            ALTER COLUMN "createdAt"
            SET DEFAULT '2025-07-17 12:10:41.789'
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "deletedAt"
        `);
    }

}
