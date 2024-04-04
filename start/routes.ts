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
import RendersController from '#controllers/renders_controller'
import AuthController from '#controllers/auth_controller'

router.get('/', async ({ response, auth }) => {
  await auth.check()
  return response.redirect('/home')
})

router.get('/home', [RendersController, 'renderHome']).as('home')

//Login/Logout

router
  .get('/login', [RendersController, 'renderLogin'])
  .as('login')
  .use(
    middleware.guest({
      guards: ['web'],
    })
  )

router.post('/login', [AuthController, 'user_login']).use(
  middleware.guest({
    guards: ['web'],
  })
)

router
  .get('/logout', [AuthController, 'logout'])
  .as('logout')
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )

//Register

router
  .get('/register', [RendersController, 'renderRegister'])
  .as('register')
  .use(
    middleware.guest({
      guards: ['web'],
    })
  )

router.post('/register', [AuthController, 'user_register']).use(
  middleware.guest({
    guards: ['web'],
  })
)

//Profile

router
  .get('/profile', [RendersController, 'renderProfile'])
  .as('profile')
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )

router.post('/profile', [AuthController, 'updateProfile']).use(
  middleware.auth({
    guards: ['web'],
  })
)

/*router
  .get('/chats', [RendersController, 'renderChats'])
  .as('chats')
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )*/

router
  .get('/add_Item', [RendersController, 'renderAddItem'])
  .as('addItems')
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
