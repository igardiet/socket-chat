const { response } = require( 'express' );
const { Category } = require( '../models' );

const obtainCategories = async ( req, res = response ) =>
{
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, categories] = await Promise.all( [
    Category.countDocuments( query ),
    Category.find( query )
      .populate( 'user', 'name' )
      .skip( Number( from ) )
      .limit( Number( limit ) ),
  ] );
  res.json( {
    total,
    categories,
  } );
};

const obtainCategory = async ( req, res = response ) =>
{
  const { id } = req.params;
  const category = await Category.findById( id ).populate( 'user', 'name' );
  res.json( category );
};

const createCategory = async ( req, res = response ) =>
{
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne( { name } );
  if ( categoryDB )
  {
    return res.status( 400 ).json( {
      msg: `Category ${categoryDB.name} already exists`,
    } );
  }
  const data = {
    name,
    user: req.user._id,
  };
  const category = new Category( data );
  await category.save();
  res.status( 201 ).json( category );
};

const updateCategory = async ( req, res = response ) =>
{
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate( id, data, { new: true } );
  res.json( category );
};

const deleteCategory = async ( req, res = response ) =>
{
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  res.json( deletedCategory );
};

module.exports = {
  obtainCategories,
  obtainCategory,
  createCategory,
  updateCategory,
  deleteCategory
};