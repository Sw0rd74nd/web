import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async userRegister({ request, response, auth }: HttpContext) {
    const register_data = request.only(['username', 'email', 'password'])
    const new_user = await User.create(register_data)
    await auth.use('web').login(new_user)
    return response.redirect('/')
  }

  public async userLogin({ request, response, auth }: HttpContext) {
    const user_data = request.only(['email', 'password'])
    const user = await User.verifyCredentials(user_data.email, user_data.password)
    await auth.use('web').login(user)
    return response.redirect('/')
  }

  public async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }

  public async updateProfile({ request, response, auth }: HttpContext) {
    const user = await User.find(auth.user!.id)
    if (user) {
      if (request.input('username')) {
        user.username = request.input('username')
      }
      if (request.input('email')) {
        user.email = request.input('email')
      }
      if (request.input('password')) {
        user.password = request.input('password')
      }
      await user.save()
    }
    return response.redirect('/profile')
  }
}
