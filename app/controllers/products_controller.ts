import Product from '#models/product'
import auth from '@adonisjs/auth/services/main'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ProductsController {
  public async addProduct({ request, response, auth }: HttpContext) {
    const product_data = request.only(['product', 'description', 'price'])
    const product = await Product.create({
      ...product_data,
      user_id: auth.user!.id,
      active: true,
    })

    return response.redirect('/productView/' + product.id)
  }

  public async deactivateProduct({ response, auth, params }: HttpContext) {
    await auth.check()

    const productID = params.id
    const product = await Product.find(productID)
    if (product) {
      product.active = false
      await product.save()
    }
    return response.redirect('/profile')
  }

  public async activateProduct({ response, auth, params }: HttpContext) {
    await auth.check()

    const productID = params.id
    const product = await Product.find(productID)
    if (product) {
      product.active = true
      await product.save()
    }
    return response.redirect('/profile')
  }
}
