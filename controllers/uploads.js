const path = require( 'path' );
const fs = require( 'fs' );
const cloudinary = require( 'cloudinary' ).v2;
cloudinary.config( process.env.CLOUDINARY_URL );
const { response } = require( 'express' );
const { uploadFile } = require( '../helpers' );
const { User, Product } = require( '../models' );

const loadFile = async ( req, res = response ) =>
{
  try
  {
    // const name = await uploadFile(req.files, ['txt', 'md'], 'texts'); -> ONLY SAVE .MD OR .TXT IN TEXTS FOLDER
    const name = await uploadFile( req.files, undefined, 'images' );
    res.json( { name } );
  } catch ( msg )
  {
    res.status( 400 ).json( { msg } );
  }
};

const updateImage = async ( req, res = response ) =>
{
  const { id, collection } = req.params;

  let model;

  switch ( collection )
  {
    case 'users':
      model = await User.findById( id );
      if ( !model )
      {
        return res.status( 400 ).json( {
          msg: `There is no user with id: ${id}`,
        } );
      }
      break;

    case 'products':
      model = await Product.findById( id );
      if ( !model )
      {
        return res.status( 400 ).json( {
          msg: `There is no product with id: ${id}`,
        } );
      }
      break;
    default:
      return res.status( 500 ).json( { msg: 'Forgot to validate this' } );
  }
  // CLEAN PREVIOUS IMAGES
  if ( model.img )
  {
    // DELETE IMAGE FROM SERVER
    const imagePath = path.join( __dirname, '../uploads', collection, model.img );
    if ( fs.existsSync( imagePath ) )
    {
      fs.unlinkSync( imagePath );
    }
  }

  const name = await uploadFile( req.files, undefined, collection );
  model.img = name;

  await model.save();

  res.json( model );
};

const updateImageCloudinary = async ( req, res = response ) =>
{
  const { id, collection } = req.params;

  let model;

  switch ( collection )
  {
    case 'users':
      model = await User.findById( id );
      if ( !model )
      {
        return res.status( 400 ).json( {
          msg: `There is no user with id: ${id}`,
        } );
      }
      break;

    case 'products':
      model = await Product.findById( id );
      if ( !model )
      {
        return res.status( 400 ).json( {
          msg: `There is no product with id: ${id}`,
        } );
      }
      break;
    default:
      return res.status( 500 ).json( { msg: 'Forgot to validate this' } );
  }
  // CLEAN PREVIOUS IMAGES
  if ( model.img )
  {
    const nameArr = model.img.split( '/' );
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split( '.' );
    cloudinary.uploader.destroy( public_id );
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
  model.img = secure_url;
  await model.save();
  res.json( model );
};

const showImage = async ( req, res = response ) =>
{
  const { id, collection } = req.params;

  let model;

  switch ( collection )
  {
    case 'users':
      model = await User.findById( id );
      if ( !model )
      {
        return res.status( 400 ).json( {
          msg: `There is no user with id: ${id}`,
        } );
      }
      break;

    case 'products':
      model = await Product.findById( id );
      if ( !model )
      {
        return res.status( 400 ).json( {
          msg: `There is no product with id: ${id}`,
        } );
      }
      break;
    default:
      return res.status( 500 ).json( { msg: 'Forgot to validate this' } );
  }
  // CLEAN PREVIOUS IMAGES
  if ( model.img )
  {
    // DELETE IMAGE FROM SERVER
    const imagePath = path.join( __dirname, '../uploads', collection, model.img );
    if ( fs.existsSync( imagePath ) )
    {
      // LITERALLY RENDER IMAGE RESPONSE
      return res.sendFile( imagePath );
    }
  }
  const noImagePath = path.join( __dirname, '../assets/no-image.jpg' );
  res.sendFile( noImagePath );
};

module.exports = {
  loadFile,
  updateImage,
  updateImageCloudinary,
  showImage
};