import User from '#models/user'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class RendersController {
  public async renderHome({ view, auth }: HttpContext) {
    await auth.check()
    return view.render('pages/main', { template: 'pages/items' })
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
  public async renderAddItem({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/addItem' })
  }
}
