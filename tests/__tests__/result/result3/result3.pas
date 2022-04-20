var c: integer;
function setMtem(i: integer): integer;
var t: integer;
begin
    t := i*2;
    result := t;
end;
begin
   c := setMtem(10);
   writeln(c);
end.