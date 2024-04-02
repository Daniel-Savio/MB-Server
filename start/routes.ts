/* eslint-disable @adonisjs/prefer-lazy-controller-import */
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import PatientsController from '#controllers/patients_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

//Auth routes
router.delete('auth/', [AuthController, 'logoutUser'])
router.post('auth/', [AuthController, 'loginUser'])
router.get('check/', [AuthController, 'authenticateUser'])

//Users routes
router.get('users/', [UsersController, 'getUsers'])
router.post('users/', [UsersController, 'create'])

//Patient routes
router.post('patients/', [PatientsController, 'store'])
//Records routes

//Tags routes
