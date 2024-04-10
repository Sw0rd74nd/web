import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class RendersController {
  public async renderHome({ view, auth, route }: HttpContext) {
    await auth.check()
    const currentRoute = route?.name
    const products = await db.from('products').where('active', 1)
    console.log(products)
    if (products.length > 0) {
      for (const product of products) {
        const user = await db.from('users').where('id', product.user_id).first()
        const previewImg = await db.from('product_imgs').where('product_id', product.id).first()
        product.username = user.username
        product.avatar = user.avatar
        product.previewImg = previewImg.img
      }
      return view.render('pages/main', {
        template: 'pages/product/products',
        products,
        currentRoute,
      })
    } else {
      return view.render('pages/main', { template: 'pages/product/noProducts', currentRoute })
    }
  }

  public async renderRegister({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/user/register' })
  }

  public async renderLogin({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/user/login' })
  }

  public async renderProfile({ view, auth }: HttpContext) {
    await auth.check()
    const products = await db.from('products').where('user_id', auth.user!.id)
    for (const product of products) {
      const previewImg = await db.from('product_imgs').where('product_id', product.id).first()
      product.previewImg = previewImg.img
    }
    return view.render('pages/main', { template: 'pages/user/profile', products })
  }

  public async renderAddProduct({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/product/addProduct' })
  }

  public async renderProductView({ view, params, auth, route, response }: HttpContext) {
    await auth.check()
    const currentRoute = route?.name
    const data = await db.from('products').where('id', params.id).first()

    if (!data) {
      return response.redirect('/home')
    }

    const user = await db.from('users').where('id', data.user_id).first()
    const imgs = await db.from('product_imgs').where('product_id', params.id)
    const username = user.username
    const avatar = user.avatar
    const product = { ...data, username, avatar, imgs }
    return view.render('pages/main', {
      template: 'pages/product/productView',
      product,
      currentRoute,
    })
  }

  public async renderSearch({ view, request, response, session, route }: HttpContext) {
    const search = request.input('search')
    const currentRoute = route?.name
    const products = await db
      .from('products')
      .where('active', 1)
      .whereLike('product', `%${search}%`)
    if (products.length > 0) {
      for (const product of products) {
        const user = await db.from('users').where('id', product.user_id).first()
        const previewImg = await db.from('product_imgs').where('product_id', product.id).first()
        product.username = user.username
        product.avatar = user.avatar
        product.previewImg = previewImg.img
      }
      return view.render('pages/main', {
        template: 'pages/product/products',
        products,
        currentRoute,
      })
    } else {
      session.flash('notification', 'Nothing found, please try again!')
      response.redirect().back()
    }
  }
}
