const ProcedureItem = require('../ProcedureItem.js');

module.exports = class WriteLn extends ProcedureItem
{
    innerRun(scope)
    {
        let outputString = '';

        scope.parameters.forEach(function(elem) {
            outputString += elem;
        });

        console.log(outputString);
    }
};