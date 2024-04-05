import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   *Controller for creating a user
   */
  async create({ response, request, auth, bouncer }: HttpContext) {
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
   *Controller for listing users but with authentication
   */
  async getUsers({ response, auth }: HttpContext) {
    const user: User = await auth.authenticate()

    response.send({ user: user.fullName, userList: User.all() })
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
  async deleteMany({ params, response, auth }: HttpContext) {
    const admin: User = await auth.authenticate()
    if (!admin.isAdmin) return response.status(501).send(`${admin.fullName} is not a admin`)

    params.IDs.forEach(async (id: number) => {
      const deletedUser = await User.findOrFail(id)
      await deletedUser.delete()
    })

    response.status(201).send('Users deleted')
  }
}
