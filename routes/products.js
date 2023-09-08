const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { validateJWT, validateFields, isAdminRole } = require( '../middlewares' );
const {
  createProduct,
  obtainProducts,
  obtainProduct,
  updateProduct,
  deleteProduct,
} = require( '../controllers' );
const { productExistsById, categoryExistsById } = require( '../helpers' );

const router = Router();

router.get( '/', obtainProducts );

router.get(
  '/:id',
  [
    check( 'id', 'It is not a valid Mongo ID' ).isMongoId(),
    check( 'id' ).custom( productExistsById ),
    validateFields,
  ],
  obtainProduct
);

router.post(
  '/',
  [
    validateJWT,
    check( 'name', 'Name is mandatory' ).not().isEmpty(),
    check( 'category', 'Is not a valid Mongo ID' ).isMongoId(),
    check( 'category' ).custom( categoryExistsById ),
    validateFields,
  ],
  createProduct
);

router.put(
  '/:id',
  [validateJWT, check( 'id' ).custom( productExistsById ), validateFields],
  updateProduct
);

router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check( 'id', 'It is not a valid Mongo ID' ).isMongoId(),
    check( 'id' ).custom( productExistsById ),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;