const { Schema, model } = require( 'mongoose' );

const UserSchema = Schema( {
  name: {
    type: String,
    required: [true, 'Name is mandatory'],
  },
  email: {
    type: String,
    required: [true, 'Email is mandatory'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is mandatory'],
    unique: true,
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    emun: ['ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
} );

// REMOVE DESIRED KEYS FROM MONGODB COLLECTION *!
UserSchema.methods.toJSON = function ()
{
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model( 'User', UserSchema );