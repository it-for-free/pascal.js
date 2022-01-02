var a: integer;

function dataFunc(a: integer): integer;
begin
    dataFunc := a+4;
end;

function  getFunction(data2Func: function(a: integer): integer): integer;
begin
    getFunction := 5 + data2Func(4);
end;

begin  
   a := getFunction(dataFunc);
   writeln(a);
end.