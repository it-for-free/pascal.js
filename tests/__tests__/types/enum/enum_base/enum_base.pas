
type
	fruit = (apple, banana, citrus);
var a, b: fruit;
f, g, e, h, m: boolean; 

begin  
   a := apple;
   writeln('a ', a);
   b := citrus;
   f := a > b;
   g := a = a;
   e := a <= b;
   h := a <> b;
   m := a < b;

end.