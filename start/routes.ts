/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
//import db from '@adonisjs/lucid/services/db'
//import hash from '@adonisjs/core/services/hash'
//import { register } from 'module'
import RendersController from '#controllers/renders_controller'

router.get('/', async ({ response }) => {
  return response.redirect('/home')
})

router.get('/home', [RendersController, 'renderHome']).as('home')

router
  .get('/login', [RendersController, 'renderLogin'])
  .as('login')
  .use(
    middleware.guest({
      guards: ['web'],
    })
  )

router
  .get('/register', [RendersController, 'renderRegister'])
  .as('register')
  .use(
    middleware.guest({
      guards: ['web'],
    })
  )

router.get('/profile', [RendersController, 'renderProfile']).as('profile')
/*.use(
    middleware.auth({
      guards: ['web'],
    })
  )*/

router.get('/chats', [RendersController, 'renderChats']).as('chats')
/*.use(
    middleware.auth({
      guards: ['web'],
    })
  )*/

router.get('/add_Item', [RendersController, 'renderAddItem']).as('addItems')
/*.use(
    middleware.auth({
      guards: ['web'],
    })
  )*/
