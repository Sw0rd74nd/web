import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { unlink } from 'fs/promises'

export default class UsersController {
  //function to register and create a user
  public async userRegister({ request, response, auth, session }: HttpContext) {
    try {
      const register_data = request.only(['username', 'email', 'password'])

      //validate username and password
      if (register_data.username.length < 3) {
        session.flash('notification', 'Username must be at least 3 characters long.')
        return response.redirect().back()
      }

      if (register_data.password.length < 8) {
        session.flash('notification', 'Password must be at least 8 characters long.')
        return response.redirect().back()
      }

      const avatar = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (!avatar?.isValid) {
        session.flash(
          'notification',
          'Please upload an image, which maxsize is 2mb and of the format jpg, png, jpeg or webp.'
        )
        return response.redirect().back()
      }

      await avatar.move(app.publicPath('uploads/avatars'), {
        name: `${cuid()}.${avatar.extname}`,
      })

      //create a new user record
      const new_user = await User.create({
        ...register_data,
        avatar: avatar.fileName,
      })

      //login the user
      await auth.use('web').login(new_user)
      return response.redirect('/')
    } catch (error) {
      session.flash('notification', 'Email already taken. Please try another one.')
      response.redirect().back()
    }
  }

  //function to login a user
  public async userLogin({ request, response, auth, session }: HttpContext) {
    try {
      //get user data from request
      const user_data = request.only(['email', 'password'])
      //verify the user credentials
      const user = await User.verifyCredentials(user_data.email, user_data.password)
      await auth.use('web').login(user)
      return response.redirect('/')
    } catch (error) {
      session.flash('notification', 'Invalid Email or Password. Please try again.')
      return response.redirect().back()
    }
  }

  //function to logout a user
  public async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }

  //function to update the user profile
  public async updateProfile({ request, response, auth, session }: HttpContext) {
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
      if (request.file('avatar')) {
        const avatar = request.file('avatar', {
          size: '2mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        })

        if (!avatar?.isValid) {
          session.flash(
            'notification',
            'Please upload an image, which maxsize is 2mb and of the format jpg, png, jpeg or webp.'
          )
          return response.redirect().back()
        }

        //delete the old avatar
        await unlink(app.publicPath(`uploads/avatars/${user.avatar}`))

        await avatar.move(app.publicPath('uploads/avatars'), {
          name: `${cuid()}.${avatar.extname}`,
        })

        //set the new avatar
        if (avatar.fileName) {
          user.avatar = avatar.fileName
        }
      }

      await user.save()
    }

    return response.redirect('/profile')
  }
}
