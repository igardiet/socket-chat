const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { validateFields, validateFile } = require( '../middlewares' );
const {
  loadFile,
  updateImage,
  showImage,
  updateImageCloudinary,
} = require( '../controllers' );
const { allowedCollections } = require( '../helpers' );

const router = Router();

router.post( '/', validateFile, loadFile );
router.put(
  '/:collection/:id',
  [
    validateFile,
    check( 'id', 'Syntax error, it must be a valid Mongo ID' ).isMongoId(),
    check( 'collection' ).custom( c =>
      allowedCollections( c, ['users', 'products'] )
    ),
    validateFields,
  ],
  updateImageCloudinary
  // updateImage
);

router.get(
  '/:collection/:id',
  [
    check( 'id', 'Id must be a valid Mongo Id' ).isMongoId(),
    check( 'collection' ).custom( c =>
      allowedCollections( c, ['users', 'products'] )
    ),
    validateFields,
  ],
  showImage
);

module.exports = router;