import Adress from '#models/adress'
import Patient from '#models/patient'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class PatientsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ response, request, auth }: HttpContext) {
    const user: User = await auth.authenticate()
    console.log(user)

    try {
      const patientAddress = await request.only(['address']).address
      const patient = await request.only(['photoUrl', 'fullName', 'cpf', 'birthDate', 'sus'])

      const newPatient = await Patient.create(patient)
      console.log(newPatient.id)
      const createdPatient = await Patient.findOrFail(newPatient.id)
      console.log(createdPatient)

      await createdPatient.related('createdBy').associate(user) // Associate the column "created_by" to the current logged user

      if (patientAddress.cep !== null) {
        console.log('Creating the address')
        patientAddress.patientId = newPatient.id
        const newAddress = await Adress.create(patientAddress)
        console.log(newAddress)
        response.status(200).send([newPatient, newAddress])
      }

      response.status(200).send(newPatient)
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        response.status(500).send('Valor duplicado')
      }
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
