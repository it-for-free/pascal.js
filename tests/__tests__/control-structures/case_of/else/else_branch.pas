program vt;
var n, m :integer;
begin
n := 10;
case n of
    1,2,3: m := 43;
    4,5,6: m := 44;
    7,8,9: m := 21
else
    m := 29
end;
writeln(m);
end.