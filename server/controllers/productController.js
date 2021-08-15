import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const products = await Product.find({ ...keyword });
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc   Deletes a product
// @route   DELETE /api/product/:id
// @access  Private && Admin

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json('Product removed');
  } else {
    res.status(401);
    throw new Error('Product not found');
  }
});

// @desc   CREATES a product
// @route   POST /api/product/
// @access  Private && Admin

export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    countInStock: 0,
    numReviews: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    description: 'Sample Description',
  });
  const createdProduct = await product.save();
  res.json(createdProduct);
});

// @desc   UPDATES a product
// @route   PUT /api/product/:id
// @access  Private && Admin

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.image = req.body.image || product.image;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.countInStock = req.body.countInStock || product.countInStock;

    const newProduct = await product.save();
    res.json(newProduct);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    CREATE a review
// @route   POST /api/product/:id/reviews
// @access  Private

export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const reviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (reviewed) {
      res.status(400);
      throw new Error('User can only leave one review!');
    }
    if (rating && comment) {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce(
          (totalRating, review) => review.rating + totalRating,
          0
        ) / product.reviews.length;

      await product.save();
      res.status(201);
      res.json('Review Added!');
    } else {
      res.status(400);
      throw new Error('Review not found, missing rating or comment');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
