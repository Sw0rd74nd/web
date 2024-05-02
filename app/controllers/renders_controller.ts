import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class RendersController {
  //function to render the home page and the products
  public async renderHome({ view, auth, route }: HttpContext) {
    await auth.check()
    const currentRoute = route?.name
    const products = await db.from('products').where('active', 1)

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
  }

  //function to render the register page
  public async renderRegister({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/user/register' })
  }

  //function to render the login page
  public async renderLogin({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/user/login' })
  }

  //function to render the profile page
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

    const ownConversations = await db
      .from('conversations')
      .join('products', 'conversations.product_id', 'products.id')
      .join('messages', 'conversations.id', 'messages.conversation_id')
      .where('conversations.buyer_id', auth.user!.id)
      .groupBy('conversations.id')

    for (const conversation of ownConversations) {
      const seller_data = await db.from('users').where('id', conversation.user_id).first()
      conversation.seller_username = seller_data.username
      conversation.seller_avatar = seller_data.avatar
    }

    return view.render('pages/main', {
      template: 'pages/user/profile',
      products,
      conversations,
      ownConversations,
    })
  }

  //function to render the add product page
  public async renderAddProduct({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/product/addProduct' })
  }


  //function to render the product view page
  public async renderProductView({ view, params, auth, route, response }: HttpContext) {
    await auth.check()
    const currentRoute = route?.name
    const data = await db.from('products').where('id', params.id).first()

    if (!data) {
      return response.status(403).send('Product does not exist')
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

  //function to render the search bar and the searched products
  public async renderSearch({ view, request, response, session, route, auth }: HttpContext) {
    await auth.check()
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

  //function to render the conversations/chats with the messages
  public async renderConvo({ view, params, response, auth }: HttpContext) {
    const conversation_data = await db
      .from('conversations')
      .where('id', params.conversation_id)
      .andWhere('product_id', params.product_id)
      .first()

    if (!conversation_data) {
      return response.status(403).send('Conversation does not exist')
    }

    const product_data = await db.from('products').where('id', conversation_data.product_id).first()

    if (conversation_data.buyer_id !== auth.user!.id && product_data.user_id !== auth.user!.id) {
      return response.status(403).send('You do not have permission to access this conversation.')
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
    for (const message of messages) {
      const sender_data = await db.from('users').where('id', message.sender_id).first()
      message.sender_username = sender_data.username
      message.sender_avatar = sender_data.avatar
    }

    return view.render('pages/main', {
      template: 'pages/conversation/convo',
      conversation,
      messages,
    })
  }
}
