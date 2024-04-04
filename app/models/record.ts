import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Patient from './patient.js'

export default class Record extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare patientId: number

  // this part does not appear in the database is just a facilitator for the Adonis Framework Functions
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // this part does not appear in the database is just a facilitator for the Adonis Framework Functions
  @belongsTo(() => Patient)
  declare patient: BelongsTo<typeof Patient>

  @column()
  declare content: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
