import type { HttpContext } from '@adonisjs/core/http'

export default class RendersController {
  async renderHome({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/items' })
  }
  async renderLogin({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/login' })
  }
  async renderRegister({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/register' })
  }
  async renderProfile({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/profile' })
  }
  async renderChats({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/chats' })
  }
  async renderAddItem({ view }: HttpContext) {
    return view.render('pages/main', { template: 'pages/addItem' })
  }
}
