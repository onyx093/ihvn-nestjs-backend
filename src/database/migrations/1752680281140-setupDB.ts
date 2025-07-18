import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupDB1752680281140 implements MigrationInterface {
    name = 'SetupDB1752680281140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_settings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "theme" character varying NOT NULL DEFAULT 'light',
                "notificationsEnabled" boolean NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.177Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.177Z"',
                CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "subject" character varying NOT NULL,
                CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"),
                CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."roles_type_enum" AS ENUM('predefined', 'custom')
        `);
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "type" "public"."roles_type_enum" NOT NULL DEFAULT 'custom',
                CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "accounts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstTimeLogin" boolean NOT NULL DEFAULT true,
                "isAccountGenerated" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.224Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.224Z"',
                "userId" uuid,
                CONSTRAINT "REL_3aa23c0a6d107393e8b40e3e2a" UNIQUE ("userId"),
                CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "cohort_courses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.261Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.261Z"',
                "cohortId" uuid,
                "courseId" uuid,
                CONSTRAINT "PK_bb65b20e2ae5d26d37883272409" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."cohorts_status_enum" AS ENUM('draft', 'active', 'completed', 'cancelled')
        `);
        await queryRunner.query(`
            CREATE TABLE "cohorts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "startDate" date NOT NULL,
                "endDate" date NOT NULL,
                "isActive" boolean NOT NULL DEFAULT false,
                "status" "public"."cohorts_status_enum" NOT NULL DEFAULT 'draft',
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.261Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.261Z"',
                "deletedAt" TIMESTAMP,
                CONSTRAINT "UQ_d1865366170f468d8eb720f8c8f" UNIQUE ("name"),
                CONSTRAINT "PK_fd38f76b135e907b834fda1e752" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "enrollments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "enrolledAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.261Z"',
                "unenrolledAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.261Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.261Z"',
                "studentId" uuid,
                "cohortId" uuid,
                "cohortCourseId" uuid,
                CONSTRAINT "UQ_adcf1fa72b095564618503ff867" UNIQUE ("studentId", "cohortId"),
                CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "students" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "referenceNumber" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.262Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.262Z"',
                "userId" uuid,
                CONSTRAINT "UQ_6ec6194ddc504f240e5edbba41b" UNIQUE ("referenceNumber"),
                CONSTRAINT "REL_e0208b4f964e609959aff431bf" UNIQUE ("userId"),
                CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "instructors" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.264Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.264Z"',
                "userId" uuid,
                CONSTRAINT "REL_dfa0fcb3c8ae7ded658b4272e1" UNIQUE ("userId"),
                CONSTRAINT "PK_95e3da69ca76176ea4ab8435098" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."attendances_status_enum" AS ENUM(
                'pending',
                'present',
                'absent',
                'late',
                'excused'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "attendances" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "status" "public"."attendances_status_enum" NOT NULL DEFAULT 'absent',
                "instructorConfirmed" boolean NOT NULL DEFAULT false,
                "confirmedAt" TIMESTAMP,
                "studentMarkedAt" TIMESTAMP,
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "lessonId" uuid,
                "studentId" uuid,
                "confirmedBy" uuid,
                CONSTRAINT "UQ_274a96c5d8bbe8b6b1825e23fff" UNIQUE ("lessonId", "studentId"),
                CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "lessons" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "date" date NOT NULL,
                "colorCode" character varying NOT NULL,
                "startTime" TIME NOT NULL,
                "endTime" TIME NOT NULL,
                "isCompleted" boolean NOT NULL DEFAULT false,
                "cohortId" uuid,
                "courseId" uuid,
                CONSTRAINT "UQ_b827c07f2190cbbcee5e4689396" UNIQUE ("date", "cohortId", "courseId"),
                CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."course_schedules_dayofweek_enum" AS ENUM('1', '2', '3', '4', '5', '6')
        `);
        await queryRunner.query(`
            CREATE TABLE "course_schedules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "dayOfWeek" "public"."course_schedules_dayofweek_enum" NOT NULL,
                "startTime" TIME NOT NULL,
                "endTime" TIME NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.270Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.270Z"',
                "deletedAt" TIMESTAMP,
                "courseId" uuid,
                CONSTRAINT "UQ_24d7017fd6fbc71a7e7e338a481" UNIQUE ("dayOfWeek", "courseId"),
                CONSTRAINT "PK_68118fc569f0c9ebb03fb79f80e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."courses_status_enum" AS ENUM('draft', 'published')
        `);
        await queryRunner.query(`
            CREATE TABLE "courses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying NOT NULL,
                "thumbnail" character varying,
                "estimatedDurationForCompletion" integer NOT NULL,
                "status" "public"."courses_status_enum" NOT NULL DEFAULT 'draft',
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.270Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.270Z"',
                "publishedAt" TIMESTAMP,
                "deletedAt" TIMESTAMP,
                "instructorId" uuid,
                "createdBy" uuid,
                CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "username" character varying,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "phoneNumber" character varying,
                "hashedRefreshToken" character varying,
                "otp" character varying,
                "otpExpiry" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.278Z"',
                "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-16T15:38:02.278Z"',
                "userSettingId" uuid,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "REL_145f73353fb4fe3115c3c1ebc7" UNIQUE ("userSettingId"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "role_permissions" (
                "roleId" uuid NOT NULL,
                "permissionId" uuid NOT NULL,
                CONSTRAINT "PK_d430a02aad006d8a70f3acd7d03" PRIMARY KEY ("roleId", "permissionId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b4599f8b8f548d35850afa2d12" ON "role_permissions" ("roleId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_06792d0c62ce6b0203c03643cd" ON "role_permissions" ("permissionId")
        `);
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "userId" uuid NOT NULL,
                "roleId" uuid NOT NULL,
                CONSTRAINT "PK_88481b0c4ed9ada47e9fdd67475" PRIMARY KEY ("userId", "roleId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId")
        `);
        await queryRunner.query(`
            ALTER TABLE "accounts"
            ADD CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "cohort_courses"
            ADD CONSTRAINT "FK_c0be0aa03607f083465e311ebc8" FOREIGN KEY ("cohortId") REFERENCES "cohorts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "cohort_courses"
            ADD CONSTRAINT "FK_a847912c02f6bb324899d1a46c8" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ADD CONSTRAINT "FK_bf3ba3dfa95e2df7388eb4589fd" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ADD CONSTRAINT "FK_06d0eec3c6a1933594a3f6e2397" FOREIGN KEY ("cohortId") REFERENCES "cohorts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ADD CONSTRAINT "FK_c6190f04f0ad8ee3bde3e8ff4ea" FOREIGN KEY ("cohortCourseId") REFERENCES "cohort_courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD CONSTRAINT "FK_e0208b4f964e609959aff431bf9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "instructors"
            ADD CONSTRAINT "FK_dfa0fcb3c8ae7ded658b4272e19" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "attendances"
            ADD CONSTRAINT "FK_2daa596a8f34add72f59d7e70d3" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "attendances"
            ADD CONSTRAINT "FK_615b414059091a9a8ea0355ae89" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "attendances"
            ADD CONSTRAINT "FK_a58649fc94673ee034a620e9d96" FOREIGN KEY ("confirmedBy") REFERENCES "instructors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "lessons"
            ADD CONSTRAINT "FK_47d18b83284c42db959130ff4c8" FOREIGN KEY ("cohortId") REFERENCES "cohorts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "lessons"
            ADD CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "course_schedules"
            ADD CONSTRAINT "FK_0e6f53d98ddeedd652315b54cbd" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_e6714597bea722629fa7d32124a" FOREIGN KEY ("instructorId") REFERENCES "instructors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_ff482a765c101d651ea06288745" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_145f73353fb4fe3115c3c1ebc72" FOREIGN KEY ("userSettingId") REFERENCES "user_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions"
            ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions"
            ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles"
            ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles"
            ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"
        `);
        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_145f73353fb4fe3115c3c1ebc72"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_ff482a765c101d651ea06288745"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_e6714597bea722629fa7d32124a"
        `);
        await queryRunner.query(`
            ALTER TABLE "course_schedules" DROP CONSTRAINT "FK_0e6f53d98ddeedd652315b54cbd"
        `);
        await queryRunner.query(`
            ALTER TABLE "lessons" DROP CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590"
        `);
        await queryRunner.query(`
            ALTER TABLE "lessons" DROP CONSTRAINT "FK_47d18b83284c42db959130ff4c8"
        `);
        await queryRunner.query(`
            ALTER TABLE "attendances" DROP CONSTRAINT "FK_a58649fc94673ee034a620e9d96"
        `);
        await queryRunner.query(`
            ALTER TABLE "attendances" DROP CONSTRAINT "FK_615b414059091a9a8ea0355ae89"
        `);
        await queryRunner.query(`
            ALTER TABLE "attendances" DROP CONSTRAINT "FK_2daa596a8f34add72f59d7e70d3"
        `);
        await queryRunner.query(`
            ALTER TABLE "instructors" DROP CONSTRAINT "FK_dfa0fcb3c8ae7ded658b4272e19"
        `);
        await queryRunner.query(`
            ALTER TABLE "students" DROP CONSTRAINT "FK_e0208b4f964e609959aff431bf9"
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments" DROP CONSTRAINT "FK_c6190f04f0ad8ee3bde3e8ff4ea"
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments" DROP CONSTRAINT "FK_06d0eec3c6a1933594a3f6e2397"
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments" DROP CONSTRAINT "FK_bf3ba3dfa95e2df7388eb4589fd"
        `);
        await queryRunner.query(`
            ALTER TABLE "cohort_courses" DROP CONSTRAINT "FK_a847912c02f6bb324899d1a46c8"
        `);
        await queryRunner.query(`
            ALTER TABLE "cohort_courses" DROP CONSTRAINT "FK_c0be0aa03607f083465e311ebc8"
        `);
        await queryRunner.query(`
            ALTER TABLE "accounts" DROP CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_86033897c009fcca8b6505d6be"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_472b25323af01488f1f66a06b6"
        `);
        await queryRunner.query(`
            DROP TABLE "user_roles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_06792d0c62ce6b0203c03643cd"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b4599f8b8f548d35850afa2d12"
        `);
        await queryRunner.query(`
            DROP TABLE "role_permissions"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "courses"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."courses_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "course_schedules"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."course_schedules_dayofweek_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "lessons"
        `);
        await queryRunner.query(`
            DROP TABLE "attendances"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."attendances_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "instructors"
        `);
        await queryRunner.query(`
            DROP TABLE "students"
        `);
        await queryRunner.query(`
            DROP TABLE "enrollments"
        `);
        await queryRunner.query(`
            DROP TABLE "cohorts"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."cohorts_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "cohort_courses"
        `);
        await queryRunner.query(`
            DROP TABLE "accounts"
        `);
        await queryRunner.query(`
            DROP TABLE "roles"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."roles_type_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "permissions"
        `);
        await queryRunner.query(`
            DROP TABLE "user_settings"
        `);
    }

}
