import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  public async user_register({ request, auth }: HttpContext) {
    const register_data = request.only(['fullName', 'email', 'password'])

    const new_user = await User.create(register_data)
    await auth.use('web').login(new_user)
  }

  public async user_login({ request, response, auth }: HttpContext) {
    const user_email = request.only(['email'])
    const user_password = request.only(['password'])
    const user = await User.verifyCredentials(user_email.email, user_password.password)
    await auth.use('web').login(user)
    return response.redirect('/')
  }

  public async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
