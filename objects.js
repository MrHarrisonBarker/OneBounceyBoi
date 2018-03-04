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


	get Modulus()
	{
		return Math.sqrt( ( this.x * this.x ) + ( this.y * this.y ) );
	}


	get Normal()
	{
		var m = this.Modulus;
		return new Vector( this.y / m, -this.x / m );
	}


	Times( a )
	{
		return new Vector( this.X * a, this.Y * a );
	}


	Add( v )
	{
		return new Vector( this.X + v.X, this.Y + v.Y );
	}

}




class Position extends Vector
{
    constructor( x, y )
    {
        super( x, y );
    }
}



class Line
{
    constructor( startPosition, endPosition )
    {
        this.start = startPosition;
		this.end = endPosition;
		this.I = true;
    }


    get Start()
    {
        return this.start;
    }


    get End()
    {
        return this.end;
	}


	get BoundingBox()
	{
		var minX = Math.min( this.Start.X, this.End.X );
		var maxX = Math.max( this.Start.X, this.End.X );
		var minY = Math.min( this.Start.Y, this.End.Y );
		var maxY = Math.max( this.Start.Y, this.End.Y );

		return new Line( new Position( minX, minY ), new Position( maxX, maxY ) );
	}


	get Vector()
	{
		return new Vector( this.End.X - this.Start.X, this.End.Y - this.Start.Y );
	}
}




EPSILON = 0.000001;

function CrossProduct( /*Position*/ a, /*Position*/ b )
{
    return a.X * b.Y - b.X * a.Y;
}



function DotProduct( /*Vector*/ a, /*Vector*/ b )
{
	return ( a.X * b.X ) + ( a.Y * b.Y );
}



function IsPointOnLine( lineA, positionB)
{
    // Move the image, so that a.first is on (0|0)
    var lineATmp = new Line( new Position( 0, 0 ), new Position( lineA.End.X - lineA.Start.X, lineA.End.Y - lineA.Start.Y ) );
    var positionBTmp = new Position( positionB.X - lineA.Start.X, positionB.Y - lineA.Start.Y );

    var r = CrossProduct( lineATmp.End, positionBTmp );

    return Math.abs( r ) < EPSILON;
}


function IsPointRightOfLine( lineA, positionB)
{
    // Move the image, so that a.first is on (0|0)
    lineATmp = new Line( new Position( 0, 0 ), new Position( lineA.End.X - lineA.Start.X, lineA.End.Y - lineA.Start.Y ) );
    positionBTmp = new Position( positionB.X - lineA.Start.X, positionB.Y - lineA.Start.Y );
    return CrossProduct( lineATmp.End, positionBTmp ) < 0;
}


function DoesLineSegmentTouchOrCrossLine( lineA, lineB )
{
    return IsPointOnLine( lineA, lineB.Start )
        || IsPointOnLine( lineA, lineB.End )
        || ( IsPointRightOfLine( lineA, lineB.Start ) ^ IsPointRightOfLine( lineA, lineB.End ) );
}


function DoBoundingBoxesIntersect( lineA, lineB )
{
	var aBox = lineA.BoundingBox;
	var bBox = lineB.BoundingBox;

	var a = aBox.Start.X <= bBox.End.X;
	var b = bBox.Start.X <= aBox.End.X;
	var c = aBox.Start.Y <= bBox.End.Y;
	var d = bBox.Start.Y <= aBox.End.Y;

	return a && b && c && d;
}


function DoLinesIntersect( lineA, lineB )
{
	var a = DoBoundingBoxesIntersect( lineA, lineB );
	var b = DoesLineSegmentTouchOrCrossLine( lineA, lineB );
	var c = DoesLineSegmentTouchOrCrossLine( lineB, lineA );

	return a && b && c;
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
    Intersects( otherBasicBlock )
    {
        var lines = this.Lines;
		var otherLines = otherBasicBlock.Lines;

		var result = [];

        for( var i=0; i<lines.length; i++ )
        {
            var line = lines[ i ];

            for( var j=0; j<otherLines.length; j++ )
            {
                var otherLine = otherLines[ j ];

				if( DoLinesIntersect( line, otherLine ) )
				{
					line.I = true;
					otherLine.I = true;

					result.push( line );
				}
            }
        }

        return result;
    }
}



class RectangleBlock extends BasicBlock
{
	constructor( initialPosition, size )
    {
		super();
        this.position = initialPosition;
		this.size = size;
		this.lines = this.MakeLines();
    }


    get Position()
    {
        return this.position;
    }


    get Size()
    {
        return this.size;
	}




    get Bottom()
    {
        return this.Position.Y + this.Size.Height;
	}


	get Lines()
	{
		var l = this.MakeLines();
		for( var i=0; i<l.length; i++ )
		{
			this.lines[i].start = l[i].start;
			this.lines[i].end = l[i].end;
		}
		return this.lines;
	}


    MakeLines()
    {
        var left = this.Position.X;
        var right = left + this.Size.Width;
        var top = this.Position.Y;
        var bottom = top + this.Size.Height;

        var tl = new Position( left, top );
        var tr = new Position( right, top );
        var bl = new Position( left, bottom );
        var br = new Position( right, bottom );

        return [
            new Line( tl, tr ),
            new Line( tr, br ),
            new Line( br, bl ),
            new Line( bl, tl ),
        ];
    }
}



class LinesBlock extends BasicBlock
{
	constructor( positions )
	{
		super();
		this.lines = [];
		for( var i = 1; i < positions.length; i++ )
		{
			this.lines.push( new Line( positions[ i ], positions[ i - 1 ] ) );
		}

		this.lines.push( new Line( positions[ 0 ], positions[ positions.length - 1 ] ) );
	}


	get Lines()
	{
		return this.lines;
	}
}







class MovingBlock extends RectangleBlock
{
    constructor( initialPosition, size, initialVelocity )
    {
        super( initialPosition, size );
        this.velocity = initialVelocity;

		this.oldPosition = new Position( initialPosition.X, initialPosition.Y );
    }


    get Velocity()
    {
        return this.velocity;
	}


	get Mass()
	{
		return 1;
	}


	AcceptPosition()
	{
		this.oldPosition.x = this.position.X;
		this.oldPosition.y = this.position.Y;
	}


	ResetPosition()
	{
		if( this.position.Y != this.oldPosition.Y )
		{
			// alert("here");
		}
		this.position.x = this.oldPosition.X;
		this.position.y = this.oldPosition.Y;
	}
}




class Player extends MovingBlock
{
    constructor()
    {
		super( new Position( 25, 700 ), new Size( 14, 50 ), new Velocity( 0, 0 ) );
    }
}



class Thing extends MovingBlock
{
	constructor( initialPosition )
	{
		super( initialPosition, new Size( 14, 14 ), new Velocity( 10, 10 ) );
	}


	get Mass()
	{
		return 0;
	}
}



var players = [ new Player() ];

var things = [ ];
for( var i=0; i < Math.random() * 10; i++ )
{
	things.push( new Thing( new Position( Math.random() * 500, Math.random() * 500 ) ) );
}

var platforms =
[
	new RectangleBlock( new Position( -100, 890 ), new Size( 1200, 100 ) ),
	new RectangleBlock( new Position( -100, -90 ), new Size( 1200, 100 ) ),

	new RectangleBlock( new Position( -90, -100 ), new Size( 100, 1200 ) ),
	new RectangleBlock( new Position( 890, -100 ), new Size( 100, 1200 ) ),

	new RectangleBlock( new Position( 50, 500 ), new Size( 400, 30 ) ),
    new RectangleBlock( new Position( 300, 800 ), new Size( 400, 30 ) ),
    new RectangleBlock( new Position( 400, 700 ), new Size( 400, 30 ) ),
	new RectangleBlock( new Position( 500, 600 ), new Size( 400, 30 ) ),

	new LinesBlock( [ new Position( 700, 500 ), new Position( 800, 450 ), new Position( 900, 200 ), new Position( 600, 50 ) ] ),
]


var allObjects = [];

players.forEach( x => allObjects.push( x ) );
platforms.forEach( x => allObjects.push( x ) );
things.forEach( x => allObjects.push( x ) );
