const { response } = require( 'express' );

const isAdminRole = ( req, res = response, next ) =>
{
  if ( !req.user )
  {
    return res.status( 500 ).json( {
      msg: 'You want to verify the role without validating the token first',
    } );
  }
  const { role, name } = req.user;
  if ( role !== 'ADMIN_ROLE' )
  {
    return res.status( 401 ).json( {
      msg: `${name} cannot perform the operation because it's not an administrator`,
    } );
  }
  next();
};

const hasRole = ( ...roles ) =>
{
  return ( req, res = response, next ) =>
  {
    if ( !req.user )
    {
      return res.status( 500 ).json( {
        msg: 'You want to verify the role without validating the token first',
      } );
    }
    if ( !roles.includes( req.user.role ) )
    {
      return res.status( 401 ).json( {
        msg: `Service requires one of these roles: ${roles}`,
      } );
    }
    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole
};