function importAll( r ) {
    const map = {};
    r.keys().forEach( key => {
        const cleanKey = key.replace( './', '' );
        map[ cleanKey ] = r( key );
    } );
    return map;
}

const images = importAll( require.context( '/src/img', false, /\.(png|jpe?g|svg|gif)$/ ) );

export default images;