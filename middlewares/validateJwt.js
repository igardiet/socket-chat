const jwt = require( 'jsonwebtoken' );
const { response, request } = require( 'express' );
const { User } = require( '../models' );

const validateJWT = async ( req = request, res = response, next ) =>
{
  const token = req.header( 'x-token' );
  if ( !token )
  {
    return res.status( 401 ).json( {
      msg: 'There is no token in the request',
    } );
  }

  try
  {
    const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
    const user = await User.findById( uid );

    if ( !user )
    {
      return res.status( 401 ).json( {
        msg: 'Token not valid - user non-existent in DB',
      } );
    }

    if ( !user.status )
    {
      return res.status( 401 ).json( {
        msg: "Token not valid - user's status: false",
      } );
    }
    req.user = user;
    next();
  } catch ( error )
  {
    console.log( error );
    res.status( 401 ).json( {
      msg: 'Token not valid',
    } );
  }
};

module.exports = { validateJWT };