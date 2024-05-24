import Product from '#models/product'
import ProductImg from '#models/product_img'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ProductsController {
  //function to create a product
  public async addProduct({ request, response, auth, session }: HttpContext) {
    //get product data from request
    const product_data = request.only(['product', 'description', 'price'])
    const product = await Product.create({
      ...product_data,
      user_id: auth.user!.id,
      active: true,
    })
    
    //validate images
    const imgs = request.files('imgs', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    const validatedImgs = imgs.filter((img) => {
      return img.isValid
    })

    //if no images are valid, return an error
    if (validatedImgs.length === 0) {
      session.flash(
        'notification',
        'Please upload at least an image, which maxsize is 2mb and of the format jpg, png, jpeg or webp.'
      )
      return response.redirect().back()
    }

    //move images to the uploads/products_imgs directory and create a ProductImg record for each image
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

  //function to deactivate a product
  public async deactivateProduct({ response, auth, params }: HttpContext) {
    await auth.check()

    const productID = params.id
    const product = await Product.find(productID)
    //if product exists, set active to false
    if (product) {
      product.active = false
      await product.save()
    }
    return response.redirect('/profile')
  }

  //function to activate a product
  public async activateProduct({ response, auth, params }: HttpContext) {
    await auth.check()

    const productID = params.id
    const product = await Product.find(productID)
    //if product exists, set active to true
    if (product) {
      product.active = true
      await product.save()
    }
    return response.redirect('/profile')
  }
}
