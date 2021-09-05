var
   a : array ['a'..'c'] of integer;
   b : array ['e'..'k'] of integer;
   a1 : integer;
begin  
   b['f'] := 5;
   a['b'] := 4;
   a['c'] := b['f'] + a['b'] + 1;

   a1 := a['c'];
end.