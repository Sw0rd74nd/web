import Conversation from '#models/conversation'
import Message from '#models/message'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ConversationsController {
  public async createConvo({ response, params, auth }: HttpContext) {
    const existingConversation = await db
      .from('conversations')
      .where('product_id', params.id)
      .where('buyer_id', auth.user!.id)
      .first()

    if (!existingConversation) {
      await Conversation.create({
        product_id: params.id,
        buyer_id: auth.user!.id,
      })
    }

    return response.redirect('/conversation/' + params.id + '/buyer')
  }

  public async createMessageBuyer({ request, response, params, auth }: HttpContext) {
    const content = request.input('message')
    const conversation = await db
      .from('conversations')
      .where('product_id', params.id)
      .where('buyer_id', auth.user!.id)
      .first()
    const conversation_id = conversation.id
    const sender_id = auth.user!.id
    const message = { conversation_id, sender_id, content }

    await Message.create({ ...message })

    return response.redirect().back()
  }

  public async createMessageSeller({ request, response, params, auth }: HttpContext) {
    const content = request.input('message')
    const conversation_id = params.id
    const sender_id = auth.user!.id
    const message = { conversation_id, sender_id, content }

    await Message.create({ ...message })

    return response.redirect().back()
  }
}
