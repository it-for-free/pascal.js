var a: integer;

function  getFunction(s: string): function(a: integer): integer;

    function dataFunc(a: integer): integer;
    begin
        dataFunc := a+4;
    end;

begin
   writeln(s);
   getFunction := dataFunc;
end;

begin  
   a := getFunction('123')(4);
   writeln(a);
end.
