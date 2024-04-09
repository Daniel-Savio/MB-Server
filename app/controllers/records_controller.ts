import Patient from '#models/patient'
import Record from '#models/record'
import type { HttpContext } from '@adonisjs/core/http'

export default class RecordsController {
  /**
   * Display a list of resource
   */
  async index({ response, auth }: HttpContext) {
    await auth.authenticate()

    try {
      const allRecords = await Record.all()
      response.send(allRecords)
    } catch (err) {
      response.send(err.message)
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ response, request, auth }: HttpContext) {
    const user = await auth.authenticate()
    const record = await request.only(['userId', 'patientId', 'content'])
    const patient = await Patient.findOrFail(record.patientId)

    try {
      const newRecord = await Record.create(record)

      //Handle the relationship between Patient and between Users
      newRecord.related('patient').associate(patient)
      newRecord.related('user').associate(user)

      response.status(200).send(newRecord)
    } catch (err) {
      response.status(500).send({ message: err.message })
    }
  }

  /**
   * Show individual record
   */
  async show({ response, params, auth }: HttpContext) {
    auth.authenticate()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
