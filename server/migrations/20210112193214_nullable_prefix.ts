import * as Knex from "knex";


export async function up (knex: Knex): Promise<void> {
    return knex.schema.hasColumn('teachers', 'prefix').then((colExists) => {
        if (colExists) {
            return knex.schema.alterTable('teachers', (table) => {
                table.string('prefix').nullable().alter();
            });
        } else {
            return knex.schema.table('teachers', (table) => {
                table.enum('prefix', ['Mr', 'Mrs', 'Ms'], {
                    useNative: true,
                    enumName: 'teacher_prefix'
                }).nullable();
            });
        }
    });
}


export async function down (knex: Knex): Promise<void> {
    await knex.schema.table('teachers', (table) => {
        table.dropColumn('prefix');
      });
    
    return knex.schema.raw('DROP TYPE teacher_prefix');
}

