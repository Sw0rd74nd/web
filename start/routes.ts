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
import ProductsController from '#controllers/products_controller'

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

router.post('/login', [AuthController, 'userLogin']).use(
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

router.post('/register', [AuthController, 'userRegister']).use(
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
  .get('/add_Product', [RendersController, 'renderAddProduct'])
  .as('addProduct')
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )

router.post('/add_Product', [ProductsController, 'addProduct']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router
  .get('/productView/:id', [RendersController, 'renderProductView'])
  .as('productView')
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
