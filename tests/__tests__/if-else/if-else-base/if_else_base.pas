ar a, b, c, d,  max2, max3, max4: integer; // секция объявления переменных
begin  // начало тела программы
    a := 7;
    b := 19;
    c := 10;
    d := 5;

    if (a > b) then
        max2 := a
    else
        max2 :=b;
 
    if (max2 > c) then
       max3 := max2
    else
       max3 := c;
 
   if (max3 > d) then
      max4 := max3
   else
      max4 := d;

   writeln('maximum ', max4);
end.