import Conversation from '#models/conversation'
import Message from '#models/message'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ConversationsController {
  //function to create a conversation
  public async createConvo({ response, params, auth }: HttpContext) {
    let conversation = await db
      .from('conversations')
      .where('product_id', params.id)
      .where('buyer_id', auth.user!.id)
      .first()

    if (!conversation) {
      conversation = await Conversation.create({
        product_id: params.id,
        buyer_id: auth.user!.id,
      })
    }

    return response.redirect('/product/' + params.id + '/conversation/' + conversation.id)
  }
  	
  //function to create a message
  public async createMessage({ request, response, params, auth }: HttpContext) {
    const content = request.input('message')

    await Message.create({
      conversation_id: params.conversation_id,
      sender_id: auth.user!.id,
      content: content,
    })

    return response.redirect().back()
  }
}
