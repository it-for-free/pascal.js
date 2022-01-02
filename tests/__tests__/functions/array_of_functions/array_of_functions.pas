var a: integer;
ar: array [1..12] of function(a, b: integer): integer;

function dataFunc(a: integer; b: integer): integer;
begin
    dataFunc := a + b;
end;

begin
   ar[8] := dataFunc;
   a := ar[8](12, 13);
   writeln(a);
end.