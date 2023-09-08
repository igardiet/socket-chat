const { Role, Category, User, Product } = require( '../models' );

const isValidRole = async ( role = '' ) =>
{
  const roleExists = await Role.findOne( { role } );
  if ( !roleExists )
  {
    throw new Error( `${role} is not registered in the DB` );
  }
  return true;
};

// EMAIL EXISTS VERIFICATION  *!
const isEmailExistent = async ( email = '' ) =>
{
  const emailExists = await User.findOne( { email } );
  if ( emailExists )
  {
    throw new Error( `${email} is already in use` );
  }
  return true;
};

const userExistsById = async id =>
{
  const userExists = await User.findById( id );
  if ( !userExists )
  {
    throw new Error( `ID: ${id} is non-existent` );
  }
  return true;
};

const categoryExistsById = async id =>
{
  const categoryExists = await Category.findById( id );
  if ( !categoryExists )
  {
    throw new Error( `ID: ${id} is non-existent` );
  }
  return true;
};

const productExistsById = async id =>
{
  const productExists = await Product.findById( id );
  if ( !productExists )
  {
    throw new Error( `ID: ${id} is non-existent` );
  }
  return true;
};

const allowedCollections = ( collection = '', collections = [] ) =>
{
  const included = collections.includes( collection );
  if ( !included )
  {
    throw new Error(
      `Collection ${collection} is not allowed, only ${collections}`
    );
  }
  return true;
};

module.exports = {
  isValidRole,
  isEmailExistent,
  userExistsById,
  categoryExistsById,
  productExistsById,
  allowedCollections
};