var
   a : array [1..10, 1..3] of integer;
   b : array [2..5] of array [1..2] of integer;
   a3, b3 : integer;
begin  
   a[1][1] := 3;
   a[2][1] := 1;
   a[3][1] := a[1][1] + a[2][1] + 1;

   b[3, 1] := a[3][1];

   a3 := a[3][1];
   b3 := b[3][1]
end.