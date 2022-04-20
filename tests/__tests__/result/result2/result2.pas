var c: integer;
function setMtem(i: integer): integer;
begin
    result := i*i;
end;
begin
   c := setMtem(6);
   writeln(c);
end.