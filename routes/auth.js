const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { validateFields, validateJWT } = require( '../middlewares' );
const { login, googleSignIn, renewToken } = require( '../controllers' );

const router = Router();

router.post(
  '/login',
  [
    check( 'email', 'Email address is mandatory' ).isEmail(),
    check( 'password', 'The password is mandatory' ).not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  '/google',
  [check( 'id_token', 'id_token is necessary' ).not().isEmpty(), validateFields],
  googleSignIn
);

router.get( '/', validateJWT, renewToken );

module.exports = router;