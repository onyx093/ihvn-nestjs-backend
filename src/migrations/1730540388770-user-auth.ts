import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAuth1730540388770 implements MigrationInterface {
  name = 'UserAuth1730540388770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user-settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "theme" character varying NOT NULL DEFAULT 'light', "notificationsEnabled" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2024-11-02T09:39:51.884Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2024-11-02T09:39:51.884Z"', CONSTRAINT "PK_0fbe28c9f064a04d90aca6b3514" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2024-11-02T09:39:51.884Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2024-11-02T09:39:51.884Z"', "userSettingId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_145f73353fb4fe3115c3c1ebc7" UNIQUE ("userSettingId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2024-11-02T09:39:51.885Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2024-11-02T09:39:51.885Z"', "userId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_145f73353fb4fe3115c3c1ebc72" FOREIGN KEY ("userSettingId") REFERENCES "user-settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_145f73353fb4fe3115c3c1ebc72"`,
    );
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user-settings"`);
  }
}
