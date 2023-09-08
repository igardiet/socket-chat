const { Socket } = require( 'socket.io' );
const { findJWT } = require( "../helpers" );
const ChatMessages = require( "../models/chatMessages" );

const chatMessages = new ChatMessages();

const socketController = async ( socket = new Socket(), io ) =>
{
    const user = await findJWT( socket.handshake.headers['x-token'] );
    if ( !user ) return socket.disconnect();

    chatMessages.connectUser( user );
    io.emit( 'active-users', chatMessages.usersArray );
    socket.emit( 'receive-messages', chatMessages.last10 );
    socket.join( user.id );

    socket.on( 'disconnect', () =>
    {
        chatMessages.disconnectUser( user.id );
        io.emit( 'active-users', chatMessages.usersArray );
    } );

    socket.on( 'send-message', ( { uid, message } ) =>
    {
        if ( uid )
        {
            socket.to( uid ).emit( 'private-message', { from: user.name, message } );
        } else
        {
            chatMessages.sendMessage( user.id, user.name, message );
            io.emit( 'receive-messages', chatMessages.last10 );
        }
    } );
};

module.exports = { socketController };