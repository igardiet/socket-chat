const validateFields = require( './validateFields' );
const validateFile = require( './validateFile' );
const validateJWT = require( './validateJwt' );
const validateRoles = require( './validateRoles' );

module.exports = {
  ...validateFields,
  ...validateFile,
  ...validateJWT,
  ...validateRoles
};