const bcrypt = require( 'bcrypt' );
const { response, request } = require( 'express' );
const { User } = require( '../models' );

const getUsers = async ( req = request, res = response ) =>
{
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  // ASYNC/AWAIT
  // const users = await User.find(query).skip(Number(from)).limit(Number(limit));
  // const total = await User.countDocuments(query)

  // PROMISE
  const [total, users] = await Promise.all( [
    User.countDocuments( query ),
    User.find( query ).skip( Number( from ) ).limit( Number( limit ) ),
  ] );
  res.json( {
    total,
    users,
  } );
};

const postUsers = async ( req, res = response ) =>
{
  const { name, email, password, role } = req.body;
  const user = new User( { name, email, password, role } );
  // PASSWORD ENCRYPTION  *!
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync( password.toString(), salt );
  // SAVE IN DB
  await user.save();
  res.json( {
    user,
  } );
};

const putUsers = async ( req, res = response ) =>
{
  const { id } = req.params;
  const { _id, password, google, ...rest } = req.body;
  if ( password )
  {
    const salt = bcrypt.genSaltSync();
    rest.password = bcrypt.hashSync( password.toString(), salt );
  }
  const user = await User.findByIdAndUpdate( id, rest );
  res.json( user );
};

const deleteUsers = async ( req, res = response ) =>
{
  const { id } = req.params;
  // const user = await User.findByIdAndDelete(id); // DELETE PHYSICALLY FROM DATABASTE
  const user = await User.findByIdAndUpdate( id, { status: false } );
  res.json( user );
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers
};