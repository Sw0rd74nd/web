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
import UsersController from '#controllers/users_controller'
import ProductsController from '#controllers/products_controller'
import ConversationsController from '#controllers/conversations_controller'

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

router.post('/login', [UsersController, 'userLogin']).use(
  middleware.guest({
    guards: ['web'],
  })
)

router
  .get('/logout', [UsersController, 'logout'])
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

router.post('/register', [UsersController, 'userRegister']).use(
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

router.post('/profile', [UsersController, 'updateProfile']).use(
  middleware.auth({
    guards: ['web'],
  })
)

//product

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

router
  .post('/productView/:id', [RendersController, 'renderSearch'])
  .as('productSearch')
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )

router.get('/productView/:id/deactivate', [ProductsController, 'deactivateProduct']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.get('/productView/:id/activate', [ProductsController, 'activateProduct']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.get('/productView', async ({ response, auth }) => {
  await auth.check()
  return response.redirect('/home')
})

//Searchbar

router.post('/home', [RendersController, 'renderSearch']).as('search')

//Conversation

router.post('/productView/:id/conversation', [ConversationsController, 'createConvo']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.get('/conversation/:id/buyer', [RendersController, 'renderConvoBuyer']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.post('/conversation/:id/buyer', [ConversationsController, 'createMessageBuyer']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.get('/conversation/:id/seller', [RendersController, 'renderConvoSeller']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.post('/conversation/:id/seller', [ConversationsController, 'createMessageSeller']).use(
  middleware.auth({
    guards: ['web'],
  })
)
