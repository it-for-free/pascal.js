var
   a : array [1..10, 1..3] of integer;
   a3 : integer;
begin  
   a[1][1] := 3;
   a[2][1] := 1;
   a[3] := a[1][1] + a[2][1] + 1;

   a3 := a[3];
end.