function drawGame()
{
	context.clearRect(0,0,width,height);
	players.forEach( drawPlayer );
	things.forEach( drawThing );
	drawLevel();
}




function drawPlatform( p )
{
	// makeRectangle( p.Position.X, p.Position.Y, p.Size.Width, p.Size.Height, "yellow" );
	DrawLines( p.Lines, "red" );
}



function drawThing( t )
{
	var r = t.Size.Width/2;
    context.beginPath();
    context.arc( t.Position.X + r , t.Position.Y + r , r, 0, 2*Math.PI );
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
	// makeRectangle( t.Position.X, t.Position.Y, t.Size.Width, t.Size.Height, "blue" );
}




function drawLevel()
{
    platforms.forEach( drawPlatform );
}




function drawPlayer( player )
{
	// makeRectangle(player.Position.X, player.Position.Y, player.Size.Width, player.Size.Height, "violet");
	DrawLines( player.Lines, "blue" );
}




function DrawLines( lines, colour )
{
	lines.forEach( l =>
	{
		context.beginPath();
		context.moveTo( l.Start.X, l.Start.Y );
		context.lineTo( l.End.X, l.End.Y );
		if( l.I )
		{
			context.strokeStyle = "red";
		}
		else
		{
			context.strokeStyle = "green";
		}
		context.stroke();

		var n = l.Vector.Normal;
		var midX = ( l.Start.X + l.End.X ) / 2;
		var midY = ( l.Start.Y + l.End.Y ) / 2;

		// context.beginPath();
		// context.moveTo( midX, midY );
		// context.lineTo( midX + ( n.X * 30 ) , midY + ( n.Y * 30 ) );
		// context.strokeStyle = "pink";
		// context.lineCap = "round";
		// context.lineWidth = 5;
		// context.stroke();
	} );
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
	var thrust = 2;
	if( keys[ 37 ] )
	{
		players[0].velocity.x -= thrust;
	}
	else if( keys[ 39 ] )
	{
		players[0].velocity.x += thrust;
	}
	// else
	// {
	// 	players[0].Velocity.x = 0;
	// }

	if( keys[ 38 ] )
	{
		players[0].velocity.y += thrust * -3;
	}
	// else if( keys[ 40 ] )
	// {
	// 	players[0].velocity.y = thrust * 1;
	// }
	// else
	// {
	// 	players[0].Velocity.y = 0;
	// }

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
	allObjects.forEach( o =>
	{
		if( o instanceof MovingBlock )
		{
			// if( o.Position.X > ( width - o.Size.Width ) )
			// {
			// 	o.Position.x = width -  o.Size.Width;
			// }

			allObjects.forEach( p =>
			{
				if( ! Object.is( p, o ) )
				{
				var lines = p.Intersects( o );
				if( lines.length > 0 )
				{
					o.ResetPosition();

					var n = lines[0].Vector.Normal;
					var dot = DotProduct( o.Velocity, n )
					if( o.Mass > 0 )
					{
						dot *= 0.8;
						if( Math.abs( dot ) < 20 )
						{
							// dot = 0;
							o.velocity = new Velocity( 0, 0 );
						}
						else
						{
							o.velocity = n.Times( dot * -2).Add( o.Velocity );
						}
					}
					else
					{
						o.velocity = n.Times( dot * -2).Add( o.Velocity );
					}



	//				o.Position.y = p.Position.Y - o.Size.Height;
					// o.Velocity.y = o.Velocity.Y * ( ( o.Mass * 0.6 ) - 1 );
					// o.Velocity.x = -o.Velocity.X * 0.4;

					// if( o.Mass > 0 && Math.abs( o.Velocity.Y ) < 20 )
					// {
					// 	o.Velocity.y = 0;
					// }
				}

			} });
			o.AcceptPosition();
		}
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
	allObjects.forEach( o => {
		o.Lines.forEach( l => {
			l.I = false
		});
	 } );

	var ticks = getTicks();
	processKeys();
	processPhysics( oldTicks, ticks )
	checkPosition();
	drawGame();

	oldTicks = ticks;
}




function processPhysics( oldTicks, ticks )
{
	var deltaT = ( ticks - oldTicks ) / 100;

	allObjects.forEach( o =>
	{
		if( o instanceof MovingBlock )
		{
			o.Position.x += o.Velocity.X * deltaT;
			o.Position.y += o.Velocity.Y * deltaT;

			if( o.Mass > 0 )
			{
				o.Velocity.y += gravity * deltaT;
			}
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
