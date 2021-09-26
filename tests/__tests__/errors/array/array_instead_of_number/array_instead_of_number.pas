type
	city = (Voronezh, Moscow, NY, Tokio, Mexico);
var
   a : array [1..3, 'a'..'c', Voronezh..Tokio] of integer;
begin  
   a[3]['b'][Voronezh] := 1;
   a[3]['c'][Moscow] :=  a[3]['b'] + 1; (* error here *)
end.
