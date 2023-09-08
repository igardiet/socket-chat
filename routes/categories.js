const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { validateJWT, validateFields, isAdminRole } = require( '../middlewares' );
const {
  createCategory,
  obtainCategories,
  obtainCategory,
  updateCategory,
  deleteCategory,
} = require( '../controllers' );
const { categoryExistsById } = require( '../helpers' );

const router = Router();

router.get( '/', obtainCategories );

router.get(
  '/:id',
  [
    check( 'id', 'It is not a valid Mongo ID' ).isMongoId(),
    check( 'id' ).custom( categoryExistsById ),
    validateFields,
  ],
  obtainCategory
);

router.post(
  '/',
  [
    validateJWT,
    check( 'name', 'Name is mandatory' ).not().isEmpty(),
    validateFields,
  ],
  createCategory
);

router.put(
  '/:id',
  [
    validateJWT,
    check( 'name', 'Name is mandatory' ).not().isEmpty(),
    check( 'id' ).custom( categoryExistsById ),
    validateFields,
  ],
  updateCategory
);

router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check( 'id', 'It is not a valid Mongo ID' ).isMongoId(),
    check( 'id' ).custom( categoryExistsById ),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;