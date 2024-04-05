import Product from '#models/product'
import User from '#models/user'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class RendersController {
  public async renderHome({ view, auth }: HttpContext) {
    await auth.check()
    const products = await db.from('products').select('*')
    for (const product of products) {
      const user = await db.from('users').where('id', product.user_id).first()
      product.username = user.username
    }
    return view.render('pages/main', { template: 'pages/product/products', products })
  }

  public async renderRegister({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/user/register' })
  }

  public async renderLogin({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/user/login' })
  }

  public async renderProfile({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/user/profile' })
  }

  public async renderChats({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/chats' })
  }

  public async renderAddProduct({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/product/addProduct' })
  }

  public async renderProductView({ view, params, auth }: HttpContext) {
    await auth.check()
    const data = await db.from('products').where('id', params.id).first()
    const user = await db.from('users').where('id', data.user_id).first()
    const username = user.username
    const product = { ...data, username }
    return view.render('pages/main', { template: 'pages/product/productView', product })
  }
}
