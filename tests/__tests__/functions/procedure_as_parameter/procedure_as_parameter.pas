var a: integer;

procedure dataProcedure(var a: integer);
begin
    a := 11;
end;

function  getFunction(data2procedure: procedure(a: integer)): integer;
var i: integer;
begin
    data2procedure(i);
    getFunction := 5 + i;
end;

begin  
   a := getFunction(dataProcedure);
   writeln(a);
end.