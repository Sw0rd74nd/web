import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class RendersController {
  public async renderHome({ view, auth, route }: HttpContext) {
    await auth.check()
    const currentRoute = route?.name
    const products = await db.from('products').where('active', 1)
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

    const conversations = await db
      .from('conversations')
      .join('products', 'conversations.product_id', 'products.id')
      .join('messages', 'conversations.id', 'messages.conversation_id')
      .join('users', 'conversations.buyer_id', 'users.id')
      .where('products.user_id', auth.user!.id)
      .groupBy('conversations.id')

    console.log(conversations)

    return view.render('pages/main', { template: 'pages/user/profile', products, conversations })
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
    const currentUser = auth.user!.id
    return view.render('pages/main', {
      template: 'pages/product/productView',
      product,
      currentRoute,
      currentUser,
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

  public async renderConvo({ view, params, response, auth }: HttpContext) {
    const product_data = await db.from('products').where('id', params.product_id).first()
    const conversation_data = await db
      .from('conversations')
      .where('id', params.conversation_id)
      .first()

    if (!product_data || !conversation_data) {
      return response.redirect('/home')
    }

    let receiver_data, sender_data

    if (conversation_data.buyer_id === auth.user!.id) {
      receiver_data = await db.from('users').where('id', product_data.user_id).first()
      sender_data = await db.from('users').where('id', conversation_data.buyer_id).first()
    } else {
      receiver_data = await db.from('users').where('id', conversation_data.buyer_id).first()
      sender_data = await db.from('users').where('id', auth.user!.id).first()
    }

    const receiver = receiver_data.username
    const receiver_avatar = receiver_data.avatar
    const sender = sender_data.username

    const conversation = { ...product_data, receiver, receiver_avatar, sender }

    const messages = await db.from('messages').where('conversation_id', conversation_data.id)

    return view.render('pages/main', {
      template: 'pages/conversation/convo',
      conversation,
      messages,
    })
  }
}
