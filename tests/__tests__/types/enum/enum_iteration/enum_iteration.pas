
type
	city = (Voronezh, Moscow, NY, Tokio, Mexico);
var a: city;
i, j, k: integer;

begin  
   i := 0;
   for a := Moscow to Tokio do 
      i := i + 1;

   j := 0;
   for a := Mexico downto Voronezh do   
      j := j + 1;

   k := 0;
   for a := Mexico to Voronezh  do   
      k := k + 1;

end.