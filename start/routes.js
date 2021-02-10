'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('users', 'UserController.store')



Route.group(() => {
  // updating username and password
  Route.put('users/:id', 'UpdateUserInfoController.update')
})//.middleware(['auth'])

Route.post('events/new/:id', 'EventController.store')

Route.post('users/forgotPassword', 'ForgotPasswordController.store')


Route.put('users/forgotPassword/:token/:email', 'ForgotPasswordController.update')


Route.get('events/list/:id', 'EventController.index')

Route.get('events/list/date/:id', 'EventController.show')

Route.delete('events/:event/delete/:id', 'EventController.destroy')
