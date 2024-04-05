import Product from '#models/product'
import User from '#models/user'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class RendersController {
  public async renderHome({ view, auth }: HttpContext) {
    await auth.check()
    return view.render('pages/main', { template: 'pages/products' })
  }
  public async renderLogin({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/login' })
  }
  public async renderRegister({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/register' })
  }
  public async renderProfile({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/profile' })
  }
  public async renderChats({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/chats' })
  }

  public async renderAddProduct({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/addProduct' })
  }

  public async renderProductView({ view, params }: HttpContext) {
    const product: Product = await db.from('products').where('id', params.id).first()
    const user = await db.from('users').where('id', product.user_id).first()

    const username = user.username

    return view.render('pages/main', { template: 'pages/productView', product, username })
  }
}
