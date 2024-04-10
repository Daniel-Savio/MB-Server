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

    const allUsers = await User.all()
    response.send(allUsers)
  }

  async show({ response, auth, params }: HttpContext) {
    auth.authenticate
    const searchedUser = await User.findOrFail(params.id)
    const allInformation = await searchedUser.preload('patient')

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

    idArray.delete.forEach(async (id: number) => {
      const deletedUser = await User.findOrFail(id)
      const patients = deletedUser.serialize()
      console.log(patients)
      //await deletedUser.delete()
    })
  }
}
