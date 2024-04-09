import Product from '#models/product'
import ProductImg from '#models/product_img'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ProductsController {
  public async addProduct({ request, response, auth, session }: HttpContext) {
    const product_data = request.only(['product', 'description', 'price'])
    const product = await Product.create({
      ...product_data,
      user_id: auth.user!.id,
      active: true,
    })

    const imgs = request.files('imgs', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    const validatedImgs = imgs.filter((img) => {
      return img.isValid
    })

    if (validatedImgs.length === 0) {
      session.flash(
        'notification',
        'Please upload at least an image, which maxsize is 2mb and of the format jpg, png, jpeg or webp.'
      )
      return response.redirect().back()
    }

    for (const img of validatedImgs) {
      await img.move(app.publicPath('uploads/products_imgs'), {
        name: `${cuid()}.${img.extname}`,
      })

      await ProductImg.create({
        product_id: product.id,
        img: img.fileName,
      })
    }

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
