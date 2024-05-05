class GlobalFunctions
{
    
	static circle_collision(c1x, c1y, r1, c2x, c2y, r2)
	{
		return (GlobalFunctions.dbp(c1x, c1y, c2x, c2y) <= r1 + r2);
	}

	static dbp(x1, y1, x2, y2) //distance between 2 points
	{
		return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
	}

	static abpr(x1, y1, x2, y2) //Angle between points radians
	{
		return Math.atan2(y2 - y1, x2 - x1);
	}
    
}
