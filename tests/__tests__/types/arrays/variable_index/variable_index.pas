var r, i: integer;
    a: array [1..100] of boolean;
begin
    for i:=1 to 100 do
        a[i] := i mod 2 = 0;
    
    if a[16] then
        r := 23
    else
        r := 133;
    
    writeln(r);
end.