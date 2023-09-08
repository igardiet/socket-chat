const url = ( window.location.hostname.includes( 'localhost' ) )
    ? 'http://localhost:8080/api/auth/'
    : 'http://localhost:8080/api/auth/';

const myForm = document.querySelector( 'form' );

myForm.addEventListener( 'submit', event =>
{
    event.preventDefault();
    const formData = {};

    for ( let element of myForm.elements )
    {
        if ( element.name.length > 0 )
            formData[element.name] = element.value;
    }
    fetch( url + 'login',
        {
            method: 'POST',
            body: JSON.stringify( formData ),
            headers: { 'Content-type': 'application/json' }
        } )
        .then( answ => answ.json() )
        .then( ( { msg, token } ) =>
        {
            if ( msg ) return console.error( msg );
            localStorage.setItem( 'token', token );
            window.location = 'chat.html';
        } )
        .catch( err => console.log( err ) );
} );

function handleCredentialResponse( response )
{
    console.log( 'id_token', response.credential );
    const body = { id_token: response.credential };

    fetch( url + 'google',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( body )
        } )
        .then( answ => answ.json() )
        .then( ( { token } ) =>
        {
            localStorage.setItem( 'token', token );
            window.location = 'chat.html';
        } )
        .catch( console.error );
}

const button = document.getElementById( 'google_signout' );
button.onclick = () =>
{
    console.log( google.accounts.id );
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke( localStorage.getItem( 'email' ), done =>
    {
        localStorage.clear();
        location.reload();
    } );
};