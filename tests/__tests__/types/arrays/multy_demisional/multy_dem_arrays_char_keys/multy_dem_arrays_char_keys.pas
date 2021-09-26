var
   a : array [1..3, 'a'..'c'] of integer;
   b : array ['o'..'r', 2..5 ,'e'..'k'] of integer;
   a1 : integer;
begin  
   b['o'][4]['f'] := 5;
   a[2]['b'] := 4;
   a[3]['c'] := b['o'][4]['f'] + a[2]['b'] + 1;

   a1 := a[3]['c'];
end.