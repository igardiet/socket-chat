const bcrypt = require( 'bcrypt' );
const { response } = require( 'express' );
const { User } = require( '../models' );
const { generateJWT, googleVerify } = require( '../helpers' );

const login = async ( req, res = response ) =>
{
  const { email, password } = req.body;
  try
  {
    // EMAIL EXISTS ?
    const user = await User.findOne( { email } );
    if ( !user )
    {
      return res.status( 400 ).json( {
        msg: 'User or Password incorrect',
      } );
    }
    // IF USER IS ACTIVE
    if ( !user.status )
    {
      return res.status( 400 ).json( {
        msg: 'User or Password incorrect - status: false',
      } );
    }
    // PASSWORD VERIFICATION
    const validPassword = bcrypt.compareSync( password, user.password );
    if ( !validPassword )
    {
      return res.status( 400 ).json( {
        msg: 'User or Password incorrect - password',
      } );
    }
    // GENERATE JWT
    const token = await generateJWT( user.id );

    res.json( {
      user,
      token,
    } );
  } catch ( error )
  {
    console.log( error );
    res.status( 500 ).json( {
      msg: 'Something went wrong',
    } );
  }
};

const googleSignIn = async ( req, res = response ) =>
{
  const { id_token } = req.body;
  try
  {
    const { email, name, img } = await googleVerify( id_token );
    let user = await User.findOne( { email } );
    if ( !user )
    {
      const data = {
        name,
        email,
        password: 'string',
        img,
        role: 'USER_ROLE',
        google: true,
      };
      user = new User( data );
      await user.save();
    }
    if ( !user.status )
    {
      return res.status( 401 ).json( {
        msg: 'Talk to Admin, user blocked',
      } );
    }
    const token = await generateJWT( user.id );
    res.json( {
      user,
      token,
    } );
  } catch ( error )
  {
    res.status( 400 ).json( {
      msg: 'Google token is not valid',
    } );
  }
};

const renewToken = async ( req, res = response ) =>
{
  const { user } = req;

  const token = await generateJWT( user.id );

  res.json( { user, token } );
};

module.exports = { login, googleSignIn, renewToken };