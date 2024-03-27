/* eslint-disable @adonisjs/prefer-lazy-controller-import */
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('users/', [UsersController, 'getUsers'])
router.post('users/', [UsersController, 'create'])
router.post('auth/', [AuthController, 'loginUser'])
router.delete('auth/', [AuthController, 'logoutUser'])
