type
	city = (Voronezh, Moscow, NY, Tokio, Mexico);
var 
   a: array [Voronezh..Tokio] of integer;
   a1: integer;
begin  
   a[Moscow] := 5;
   a[Tokio] := 4;
   a[Voronezh] := a[Moscow] +  a[Tokio]  + 1;
   a1 := a[Voronezh];
end.