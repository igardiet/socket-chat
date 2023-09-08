const dbValidators = require( './dbValidators' );
const generateJWT = require( './generateJwt' );
const googleVerify = require( './googleVerify' );
const uploadFile = require( './uploadFile' );

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...uploadFile
};