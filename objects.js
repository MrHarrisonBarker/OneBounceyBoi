class Vector
{
    constructor( x, y )
    {
        this.x = x;
        this.y = y;
    }


    get X()
    {
        return this.x;
    }


    get Y()
    {
        return this.y;
    }
}




class Position extends Vector
{
    constructor( x, y )
    {
        super( x, y );
    }
}




class Size extends Vector
{
    constructor( width, height )
    {
        super( width, height );
    }


    get Width()
    {
        return this.x;
    }


    get Height()
    {
        return this.y;
    }
}




class Velocity extends Vector
{
    constructor( dx, dy )
    {
        super( dx, dy );
    }


    get DX()
    {
        return this.x;
    }


    get DY()
    {
        return this.y;
    }
}




class Acceleration extends Vector
{
    constructor( ddx, ddy )
    {
        super( ddx, ddy );
    }


    get DDX()
    {
        return this.x;
    }


    get DDY()
    {
        return this.y;
    }
}





class BasicBlock
{
    constructor( initialPosition, size )
    {
        this.position = initialPosition;
        this.size = size;
    }


    get Position()
    {
        return this.position;
    }


    get Size()
    {
        return this.size;
    }
}




class MovingBlock extends BasicBlock
{
    constructor( initialPosition, size, initialVelocity )
    {
        super( initialPosition, size );
        this.velocity = initialVelocity;
    }


    get Velocity()
    {
        return this.velocity;
    }
}




class Player extends MovingBlock
{
    constructor()
    {
        super( new Position( 25, 25 ), new Size( 14, 50 ), new Velocity( 0, 0 ) );
    }
}





var players = [ new Player() ];


var platforms =
[
    new BasicBlock( new Position( 50, 500 ), new Size( 400, 30 ) )
]


var allObjects = [];

players.forEach( x => allObjects.push( x ) );
platforms.forEach( x => allObjects.push( x ) );
