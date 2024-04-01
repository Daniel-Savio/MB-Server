import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'patients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('created_by').unsigned().references('users.id')
      table.string('photo_url').nullable()
      table.string('full_name')
      table.string('cpf').unique().nullable()
      table.string('birth_date')
      table.string('sus')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
