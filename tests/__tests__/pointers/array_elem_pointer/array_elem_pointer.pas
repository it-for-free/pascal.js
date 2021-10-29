var a, b: integer;
ar: array [1..2] of integer;
p: ^integer;
pp: ^^integer;

begin
   ar[1] := 32;
   p := @ar[1];
   pp := @p;
   b := pp^^;
   writeln(b);
end.