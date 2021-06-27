var a, b, c: integer;
begin  
   for a := 1 to 10 do
   begin
      if (a = 7) then
         break;
   end;

   while (b <= 20) do
   begin
      b := b + 1;
      if (b = 8) then
         break;
   end;

   repeat
      c := c + 1;
      if (c = 9) then
         break;
   until (c >= 15);
end.