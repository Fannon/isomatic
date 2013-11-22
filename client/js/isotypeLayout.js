/* jshint jquery:true, devel: true */
/* global isomatic, d3 */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

/**
 * Isotype Layout
 * 2013 Simon Heimler
 *
 * TODO: Do not use anything from isomatic namespace (like options) -> No external dependencies!
 * TODO: Check if every needed value is set before its used.
 *
 * @returns {Function}
 */
d3.layout.isotype = function() {
    "use strict";


    // Private Variables. Some with default values
    var value = Number;
    var width, height;
    var scale;
    var roundDown = 0.2;
    var roundUp = 0.8;

    function isotype(data) {

        console.log('d3.layout.isotype();');

        /**
         * Processed Data
         * @type {Array}
         */
        var processedData = [];

        /**
         * Processed Data with an Item per rendered Icon
         * @type {Array}
         */
        var fullyProcessedData = [];


        ///////////////////////////////////////
        // Calculating Layout                //
        ///////////////////////////////////////

        // Iterate over Rows
        for (var rowCounter = 0; rowCounter < data.length; rowCounter++) {

            var columnCounter = 0;
            var columnName = '';
            var currentRow = data[rowCounter];

            // Iterate over Columns
            for (var obj in currentRow) {
                if(currentRow.hasOwnProperty(obj)){

                    var v = currentRow[obj];

                    if (columnCounter === 0) {
                        columnName = v;
                    } else {

                        // Round the Value according to Options
                        var value = 0;
                        var roundedValue = Math.floor(v / scale);
                        var leftOver = (v / scale) % 1;

                        if (leftOver > roundDown && leftOver < roundUp) {
                            value = roundedValue + leftOver;
                        } else if (leftOver > 0.5) {
                            value = roundedValue + 1;
                        } else {
                            value = roundedValue;
                        }

                        // Calculate processed Data (Just for Debugging)

                        processedData.push({
                            column: columnName,
                            row: obj,
                            count: value,
                            rawValue: v
                        });

                        // Calculate Fully Processed Data

                        // Iterate over Icons
                        for (var j = 0; j < columnName.length; j++) {
                            var obj1 = columnName[j];

                            var size = 1;

                            if (j === columnName.length - 1 && value % 1 !== 0) {
                                size = value % 1;
                            }

                            fullyProcessedData.push({
                                row: rowCounter,
                                column: columnCounter,
                                icon: j,
                                size: size
                            });
                        }
                    }

                    columnCounter += 1;
                }
            }

        }

        console.log('-> Processed Data:');
        console.dir(processedData);

        console.log('-> Fully Processed Data:');
        console.dir(fullyProcessedData);
        isomatic.data.processed = fullyProcessedData;

        return processedData;
    }

    isotype.width = function(n) {
        width = n;
        return isotype;
    };

    isotype.height = function(n) {
        height = n;
        return isotype;
    };

    isotype.scale = function(n) {
        scale = n;
        return isotype;
    };

    isotype.roundDown = function(n) {
        roundDown = n;
        return isotype;
    };

    isotype.roundUp = function(n) {
        roundUp = n;
        return isotype;
    };


    /**
     * Specifies the value function *x*, which returns a nonnegative numeric value
     * for each datum. The default value function is `Number`. The value function
     * is passed two arguments: the current datum and the current index.
     */
    isotype.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = x;
        return isotype;
    };




    return isotype;
};
