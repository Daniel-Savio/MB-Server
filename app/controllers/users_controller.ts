import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   *Controller for creating a user
   */
  async create({ response, request, auth }: HttpContext) {
    // Authentication method
    const admin: User = await auth.authenticate()

    if (!admin.isAdmin) return response.status(501).send(`${admin.fullName} is not a admin`)

    const newUser = await request.only(['fullName', 'celphone', 'email', 'password', 'isAdmin'])
    try {
      const user = await User.create(newUser)
      return user.fullName, user.email
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        response.status(400).send({ message: 'The user already exist' })
      } else {
        response.status(500).send({ message: err.message })
      }
    }
  }

  /**
   *Controller for listing all users but with authentication
   */
  async index({ response, auth }: HttpContext) {
    await auth.authenticate()

    const allUsers = await User.query().preload('patient')

    response.send(allUsers)
  }

  async show({ response, auth, params }: HttpContext) {
    auth.authenticate
    const searchedUser = await User.findOrFail(params.id)
    await searchedUser.load('patient')
    await searchedUser.load('record')

    response.send(searchedUser)
  }

  /**
   *Deletes a user by its ID
   */
  async delete({ params, response, auth }: HttpContext) {
    const admin: User = await auth.authenticate()
    if (!admin.isAdmin) return response.status(501).send(`${admin.fullName} is not a admin`)

    const deletedUser = await User.findOrFail(params.id)
    await deletedUser.delete()
    response.status(201).send('User deleted')
  }

  /**
   *Recives a array of Users IDs to be deletes
   */
  async deleteMany({ request, response, auth }: HttpContext) {
    const admin: User = await auth.authenticate()
    if (!admin.isAdmin) return response.status(501).send(`${admin.fullName} is not a admin`)

    const idArray: { delete: number[] } = await request.only(['delete'])
    let usersToBeDeleted: User[] = []

    // ? Loop through out the whole users array to dissociate everything

    try {
      await idArray.delete.forEach(async (id: number) => {
        const deletedUser = await User.findOrFail(id)

        // ? Here we need to first dissociate everything from the deleted user so it can be deleted ? //
        await deletedUser!.load('patient')
        await deletedUser!.load('record')
        await deletedUser!.serialize()

        // ? Oce we loaded every dependecy information we need to dissociate each of them ? //
        const patients = deletedUser.patient
        const records = deletedUser.record

        if (patients.length) {
          patients.forEach(async (patient) => {
            await patient.related('user').dissociate()
          })
        }

        if (records.length) {
          records.forEach(async (record) => {
            await record.related('user').dissociate()
          })
        }

        usersToBeDeleted.push(deletedUser)
      })
    } catch (err) {
      response.send({ usersNotFound: err })
    }

    if (!usersToBeDeleted) {
      response.status(400).send({ message: 'No users to be deleted' })
    }

    usersToBeDeleted.forEach(async (user) => {
      user.delete()
      response.status(200).send('deleted')
    })
  }
}
