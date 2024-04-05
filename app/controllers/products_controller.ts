import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'

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
}
