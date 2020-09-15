import { Migration } from '@mikro-orm/migrations';

export class Migration20200915064530 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" jsonb not null, "title" varchar(255) not null);');
  }

}
