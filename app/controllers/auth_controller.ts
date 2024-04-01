import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   *login
   */
  async loginUser({ request, response }: HttpContext): Promise<void> {
    const { email, password } = request.only(['email', 'password'])

    // Check the user data
    const user = await User.verifyCredentials(email, password)
    // if its not match, abort the request
    if (!user) {
      response.abort('Invalid credentials')
    }

    // Create a acesses token if the user is autenticated
    const accessToken = await User.accessTokens.create(user, ['*'], {
      name: 'oat_',
      expiresIn: '30 day',
    })

    response.status(200).send(accessToken)
  }

  /**
   *logout
   */
  async logoutUser({ response, auth }: HttpContext): Promise<void> {
    const user: User = await auth.authenticate()
    const tokenId = user.currentAccessToken?.identifier! //apenas avisando que esse valor não será undefined
    User.accessTokens.delete(user, tokenId)
    response.status(210).send('User logged out')
  }

  /**
   *Check authentication
   */
  async authenticateUser({ response, auth }: HttpContext) {
    await auth.check()
    const user: User = await auth.authenticate()
    if (await auth.check()) {
      await response.status(200).send({ user: { id: user.id, name: user.fullName } })
    } else {
      await response.status(401)
    }
  }
}
