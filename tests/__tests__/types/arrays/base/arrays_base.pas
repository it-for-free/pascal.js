var
   a : array [1..10] of integer;
   a1, a2 : integer;
begin  
   a[1] := 2;
   a[2] := 4;
   a[3] := a[2] + 1;

   a2 := a[2];
   a1 := a[3];
end.