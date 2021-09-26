
var a, b: integer;

function sumAnd(b, c: integer; var d: integer): integer;
begin
   d := 4;
   sumAnd := b + c;
end;

begin
  b := 2; 
  a := sumAnd(5, 3, b);
end.
