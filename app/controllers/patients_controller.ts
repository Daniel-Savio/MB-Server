import Adress from '#models/adress'
import Patient from '#models/patient'
import User from '#models/user'
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
   * Receavies a single ID and deletes it if it exists
   */
  async delete({ response, params, auth }: HttpContext) {
    const admin: User = await auth.authenticate()
    if (!admin.isAdmin) response.status(403).send(`${admin.fullName} is not a admin`)

    const deletedPatient = await Patient.findOrFail(params.id)
    await deletedPatient.delete()
    response.status(201).send('Patient deleted successfully')
  }

  /**
   * Receavies a array of patients IDs and delete eachone
   */
  async deleteMany({ response, params, auth }: HttpContext) {
    const admin: User = await auth.authenticate()
    if (!admin.isAdmin) response.status(403).send(`${admin.fullName} is not a admin`)

    params.IDs.forEach(async (id: number) => {
      const deletedPatient = await Patient.find(id)
      await deletedPatient!.delete()
    })
  }
}
