import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersTable1675845268000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let scmd = 'INSERT INTO `users` (`usr`, `code`) VALUES ("daoduylai", 621999);';
    await queryRunner.query(scmd);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
