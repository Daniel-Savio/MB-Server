import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Patient from './patient.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Adress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => Patient)
  declare adressFor: BelongsTo<typeof Patient>

  @column()
  declare cep: string

  @column()
  declare city: string

  @column()
  declare state: string

  @column()
  declare road: string

  @column()
  declare number: string | number

  @column()
  declare complement: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
