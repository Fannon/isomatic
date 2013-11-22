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
            var iconPosition = 0;
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
                        for (var j = 0; j < Math.ceil(value); j++) {

                            // Calculate Size
                            var size = 1;
                            if (j === columnName.length - 1 && value % 1 !== 0) {
                                size = value % 1;
                            }

                            fullyProcessedData.push({
                                row: rowCounter,
                                col: columnCounter,
                                pos: iconPosition,
                                size: size
                            });

                            iconPosition += 1;
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

        return fullyProcessedData;
    }


    /**
     * Sets the Scale how much one icon is representating
     * This is mandatory!
     *
     * @param n Scale Factor
     * @returns {Function}
     */
    isotype.scale = function(n) {
        scale = n;
        return isotype;
    };

    /**
     * Sets the Option when the Size is rounded down to reduce visual clutter
     * This is optional.
     *
     * @param n
     * @returns {Function}
     */
    isotype.roundDown = function(n) {
        roundDown = n;
        return isotype;
    };

    /**
     * Sets the Option when the Size is rounded up to reduce visual clutter
     * This is optional.
     *
     * @param n
     * @returns {Function}
     */
    isotype.roundUp = function(n) {
        roundUp = n;
        return isotype;
    };

    return isotype;
};
