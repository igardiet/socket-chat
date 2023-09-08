const authController = require( './auth' );
const categoriesController = require( './categories' );
const productsController = require( './products' );
const searchController = require( './search' );
const uploadsController = require( './uploads' );
const usersController = require( './users' );

module.exports = {
  ...authController,
  ...categoriesController,
  ...productsController,
  ...searchController,
  ...uploadsController,
  ...usersController
};