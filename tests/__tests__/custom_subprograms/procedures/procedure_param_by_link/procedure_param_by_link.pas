
var a, b: integer;

procedure change(var c: integer; d: integer);
begin
   c := 5;
   d := 5;
end;

begin
  a:=4;
  b:=4;
  change(a, b);
end.
