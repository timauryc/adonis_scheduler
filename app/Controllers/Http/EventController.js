'use strict'

const Event = use('App/Models/Event') // user model

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response, params }) {
    try {
      const userID = params.id // logged user ID

      console.log("this is the id: " + userID)

      const events = await Event.query()
        .where({
          user_id: userID
        }).fetch()

      return events
    } catch (err) {
      return response.status(err.status)
    }
  }
  /**
   * Render a form to be used for creating a new event.
   * GET events/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, params }) {
    try {
      const { title, location, date, time } = request.all() // info for the event
      const userID = params.id // retrieving user id current logged

      const newEvent = await Event.create({ user_id: userID, title, location, date, time })

      return newEvent
    } catch (err) {
      return response
        .status(err.status)
        .send({
          message: {
            error: 'Something went wrong while creating new event'
          }
        })
    }
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ request, response, params }) {
    try {
      const { date } = request.only(['date']) // desired date
      const userID = params.id // logged user's ID

      const event = await Event.query()
        .where({
          user_id: userID,
          date
        }).fetch()

      if (event.rows.length === 0) {
        return response
          .status(404)
          .send({
            message: {
              error: 'No event found'
            }
          })
      }

      return event
    } catch (err) {
      if (err.name === 'ModelNotFoundException') {
        return response
          .status(err.status)
          .send({
            message: {
              error: 'No event found'
            }
          })
      }
      return response.status(err.status)
    }
  }

  /**
   * Render a form to update an existing event.
   * GET events/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const eventID = params.event // event's id to be deleted
    const userID = params.id // logged user's ID

    // looking for the event
    const event = await Event.query()
      .where({
        id: eventID,
        user_id: userID
      }).fetch()

    /**
     * As the fetched data comes within a serializer
     * we need to convert it to JSON so we are able 
     * to work with the data retrieved
     * 
     * Also, the data will be inside an array, as we
     * may have multiple results, we need to retrieve
     * the first value of the array
     */
    const jsonEvent = event.toJSON()[0]

    // checking if event belongs to user
    if (jsonEvent['user_id'] !== userID) {
      return response
        .status(401)
        .send({
          message: {
            error: 'You are not allowed to delete this event'
          }
        })
    }

    // deleting event
    await Event.query()
      .where({
        id: eventID,
        user_id: userID
      }).delete()
  }
}

module.exports = EventController
