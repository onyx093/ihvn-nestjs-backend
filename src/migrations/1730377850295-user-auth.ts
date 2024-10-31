import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAuth1730377850295 implements MigrationInterface {
    name = 'UserAuth1730377850295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-settings" ALTER COLUMN "createdAt" SET DEFAULT '"2024-10-31T12:30:52.772Z"'`);
        await queryRunner.query(`ALTER TABLE "user-settings" ALTER COLUMN "updatedAt" SET DEFAULT '"2024-10-31T12:30:52.772Z"'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '"2024-10-31T12:30:52.773Z"'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT '"2024-10-31T12:30:52.773Z"'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '"2024-10-31T12:30:52.773Z"'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '"2024-10-31T12:30:52.773Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '2024-10-31 12:29:24.319'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '2024-10-31 12:29:24.319'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT '2024-10-31 12:29:24.321'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '2024-10-31 12:29:24.321'`);
        await queryRunner.query(`ALTER TABLE "user-settings" ALTER COLUMN "updatedAt" SET DEFAULT '2024-10-31 12:29:24.318'`);
        await queryRunner.query(`ALTER TABLE "user-settings" ALTER COLUMN "createdAt" SET DEFAULT '2024-10-31 12:29:24.318'`);
    }

}
