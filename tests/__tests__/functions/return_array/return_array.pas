var a: array [1 .. 5] of integer;
e: integer;

function setItem(): array [1 .. 5] of integer;
var  b: array [1 .. 5] of integer;
begin
    b[1] := 152;
    setItem := b;
end;

begin
   e := setItem()[1];
   writeln(e);
end.