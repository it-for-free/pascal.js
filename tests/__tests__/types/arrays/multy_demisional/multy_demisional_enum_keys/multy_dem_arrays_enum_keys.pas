type
	city = (Voronezh, Moscow, NY, Tokio, Mexico);
var
   a : array [1..3, 'a'..'c', Voronezh..Tokio] of integer;
   b : array ['o'..'r', 2..5 ,'e'..'k'] of integer;
   a1 : integer;
begin  
   b['o'][4]['f'] := 5;
   a[2]['b'][Voronezh] := 4;
   a[3]['c'][Moscow] := b['o'][4]['f'] + a[3]['b'] + 1;

   a1 := a[3]['c'][Moscow];
end.

