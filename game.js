function drawGame()
{
	context.clearRect(0,0,width,height);
	players.forEach( drawPlayer );
	drawLevel();
}




function drawPlatform( p )
{
	makeRectangle( p.Position.X, p.Position.Y, p.Size.Width, p.Size.Height, "brown" );
}




function drawLevel()
{
    platforms.forEach( drawPlatform );
}




function drawPlayer( player )
{
    makeRectangle(player.Position.X, player.Position.Y, player.Size.Width, player.Size.Height, "violet");
}




function makeRectangle (x , y , w , h , colour)
{
    context.beginPath();
    context.rect( x , y , w , h );
    context.fillStyle = colour;
    context.fill();
    context.closePath();
}




//TODO: hould these be moved into an initialise function or a class?
var keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

function processKeys()
{

	if( keys[ 37 ] )
	{
		players[0].Position.x -= 10;
	}

	if( keys[ 39 ] )
	{
		players[0].Position.x += 10;
	}

	if( keys[ 38 ] )
	{
		players[0].Position.y -= 10;
	}

	if( keys[ 40 ] )
	{
		players[0].Position.y += 10;
	}

	if( players[0].Position.x < 0 )
	{
		players[0].Position.x = 0;
	}

	if( players[0].Position.y < 0 )
	{
		players[0].Position.y = 0;
	}

}




function checkPosition()
{
	//TODO: Some refactoring and movin into the classes
	players.forEach( o =>
	{
		if( o.Position.X > ( width - o.Size.Width ) )
		{
			o.Position.x = width -  o.Size.Width;
		}

		platforms.forEach( p =>
		{
			if(
				( o.Position.X > p.Position.X )
				&&
				( o.Position.X < ( p.Position.X + p.Size.Width ) )
				&&
				( o.Bottom > p.Position.Y )
				&&
				( o.Bottom < p.Bottom )
				)
			{
				o.Position.y = p.Position.Y - o.Size.Height;
				o.Velocity.y = -o.Velocity.Y * 0.4;

				if( Math.abs( o.Velocity.Y ) < 20 )
				{
					o.Velocity.y = 0;
				}
			}
		} );
	} );
}




function getTicks()
{
	var date = new Date();
	return date.getTime();
}




//TODO: Move into initialisation function or class constructor
var oldTicks = getTicks();

function gameLoop()
{
	var ticks = getTicks();
	processKeys();
	processPhysics( oldTicks, ticks )
	checkPosition();
	drawGame();

	oldTicks = ticks;
}




function processPhysics( oldTicks, ticks )
{
	var deltaT = ( ticks - oldTicks ) / 50;

	allObjects.forEach( o =>
	{
		if( o instanceof MovingBlock )
		{
			o.Position.x += o.Velocity.X * deltaT;
			o.Position.y += o.Velocity.Y * deltaT;

			o.Velocity.y += gravity * deltaT;
		}
	} );
}




function StartGame()
{
	// Global variables - eurgh :-(

	canvas = document.getElementById( "myCanvas" );
	context = canvas.getContext( "2d" );

	height = canvas.height;
	width = canvas.width;

	gravity = 9.81;

	setInterval( gameLoop, 20 );
}
