import Conversation from '#models/conversation'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ConversationsController {
  public async createConvo({ response, params, auth, session }: HttpContext) {
    const product_data = await db.from('products').where('id', params.id).first()
    const seller_id = await db.from('users').where('id', product_data.user_id).first()

    if (seller_id.id === auth.user!.id) {
      session.flash('notification2', 'This is you own product!')
      return response.redirect().back()
    }

    const existingConversation = await db
      .from('conversations')
      .where('product_id', product_data.id)
      .where('buyer_id', auth.user!.id)
      .first()

    if (!existingConversation) {
      await Conversation.create({
        product_id: product_data.id,
        buyer_id: auth.user!.id,
      })
    }

    return response.redirect('/conversation/' + params.id)
  }

  public async createMessage() {}
}
