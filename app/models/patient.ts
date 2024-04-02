import { DateTime } from 'luxon'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Record from './record.js'
import Adress from './adress.js'
import Tag from './tag.js'

export default class Patient extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => User)
  declare createdBy: BelongsTo<typeof User>

  @column()
  declare photoUrl: string | null

  @column()
  declare fullName: string

  @column()
  declare cpf: string

  @column()
  declare birthDate: string

  @column()
  declare sus: string

  @hasOne(() => Adress)
  declare address: HasOne<typeof Adress>

  @hasMany(() => Record)
  declare records: HasMany<typeof Record>

  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
