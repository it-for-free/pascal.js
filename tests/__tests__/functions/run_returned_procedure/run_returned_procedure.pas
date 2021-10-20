var a: integer;

function  getFunction(s: string): procedure(a: integer);

    procedure dataProcedure(var a: integer);
    begin
        a := 17;
    end;

begin
   writeln(s);
   getFunction := dataProcedure;
end;

begin  
   getFunction('123')(a);
   writeln(a);
end.