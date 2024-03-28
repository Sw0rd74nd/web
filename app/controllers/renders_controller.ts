import type { HttpContext } from '@adonisjs/core/http'

export default class RendersController {
  async renderHome(ctx: HttpContext) {
    return ctx.view.render('pages/main', { template: 'pages/items' })
  }
  async renderLogin(ctx: HttpContext) {
    return ctx.view.render('pages/main', { template: 'pages/login' })
  }
  async renderRegister(ctx: HttpContext) {
    return ctx.view.render('pages/main', { template: 'pages/register' })
  }
  async renderProfile(ctx: HttpContext) {
    return ctx.view.render('pages/main', { template: 'pages/profile' })
  }
  async renderChats(ctx: HttpContext) {
    return ctx.view.render('pages/main', { template: 'pages/chats' })
  }
  async renderAddItem(ctx: HttpContext) {
    return ctx.view.render('pages/main', { template: 'pages/addItem' })
  }
}
