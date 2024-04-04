import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const createUser = Bouncer.ability((user: User) => {
  return user.isAdmin
})

export const deletePatient = Bouncer.ability((user: User) => {
  return user.isAdmin
})
