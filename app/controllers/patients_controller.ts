import { deletePatient } from '#abilities/main'
import Adress from '#models/adress'
import Patient from '#models/patient'
import type { HttpContext } from '@adonisjs/core/http'

export default class PatientsController {
  /**
   * Display a list of resource
   */
  async index({ response, auth }: HttpContext) {
    await auth.authenticate()
    const allPatients = await Patient.all()
    response.send(allPatients)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ response, request, auth }: HttpContext) {
    const user = await auth.authenticate()
    console.log(user)

    try {
      const patientAddress = await request.only(['address']).address
      const patient = await request.only(['photoUrl', 'fullName', 'cpf', 'birthDate', 'sus'])

      const newPatient = await Patient.create(patient)
      await newPatient.related('user').associate(user) // Associate the column "user_id" to the current logged user

      if (patientAddress.cep) {
        const newAddress = await Adress.create(patientAddress)
        await newAddress.related('patient').associate(newPatient) // Associate the column "patient_id" to the new patient created
      }

      response.status(200).send([newPatient, patientAddress])
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        response.status(500).send('Valor duplicado')
      } else {
        response.status(500).send(err.message)
      }
    }
  }

  /**
   * Show individual patient based on the ID
   */
  async show({ response, params, auth }: HttpContext) {
    await auth.authenticate
    const chosenPatient = await Patient.findOrFail(params.id)
    response.send(chosenPatient)
  }

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Receavies a array of patients IDs and delete eachone
   */
  async destroy({ response, params, auth, bouncer }: HttpContext) {
    auth.authenticate()
    if (await bouncer.allows(deletePatient)) {
      return response.forbidden('You are not an administrator')
    }
    params.IDs.forEach(async (id: number) => {
      const deletedPatient = await Patient.find(id)
      await deletedPatient!.delete()
    })
  }
}
