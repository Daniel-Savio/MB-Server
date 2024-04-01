import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'adresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('patient_id').unsigned().references('patients.id')
      table.string('cep', 9)
      table.string('city')
      table.string('state')
      table.string('road')
      table.string('number')
      table.string('complement')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
