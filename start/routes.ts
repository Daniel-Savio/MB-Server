/* eslint-disable @adonisjs/prefer-lazy-controller-import */
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import PatientsController from '#controllers/patients_controller'
import RecordsController from '#controllers/records_controller'

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
router.get('users/', [UsersController, 'index'])
router.get('users/:id', [UsersController, 'show'])
router.post('users/add', [UsersController, 'create'])
router.delete('users/delete', [UsersController, 'delete'])
router.delete('users/deleteMany', [UsersController, 'deleteMany'])

//Patient routes
router.get('patients/', [PatientsController, 'index'])
router.get('patients/:id', [PatientsController, 'show'])
router.post('patients/add', [PatientsController, 'store'])
router.delete('patients/delete', [PatientsController, 'delete'])
router.delete('patients/deleteMany', [PatientsController, 'deleteMany'])

//Records routes
router.get('records/', [RecordsController, 'index'])
router.post('records/add', [RecordsController, 'store'])

//Tags routes
