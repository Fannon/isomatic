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
 * @returns {Function}
 */
d3.layout.isotype = function() {
    "use strict";

    // Private Variables
    var value = Number;
    var width;
    var height;

    function isotype(data) {

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

        console.log('Isotype Layout: Processing Data.');

        // Calculate the Scale
        var scale = calculateScale(data);

        // Calculating the processed Data
        for (var i = 0; i < data.length; i++) {

            var columnCounter = 0;
            var columnName = '';
            var row = data[i];

            for (var obj in row) {

                var v = row[obj];

                if (columnCounter === 0) {
                    columnName = v;
                } else {

                    // Round the Value according to Options
                    var value = 0;
                    var roundedValue = Math.floor(v / scale);
                    var leftOver = (v / scale) % 1;

                    if (leftOver > isomatic.options.roundDown && leftOver < isomatic.options.roundUp) {
                        value = roundedValue + leftOver;
                    } else {
                       value = roundedValue;
                    }

                    processedData.push({
                        column: columnName,
                        row: obj,
                        count: value,
                        rawValue: v
                    });

                    // Calculate Fully Processed Data
                    for (var j = 0; j < columnName.length; j++) {
                        var obj1 = columnName[j];

                        var size = 1;

                        if (j === columnName.length - 1 && value % 1 !== 0) {
                            size = value % 1;
                        }

                        fullyProcessedData.push({
                            column: columnName,
                            row: obj,
                            size: size,
                            x: 0,
                            y: 0
                        });
                    }
                }

                columnCounter += 1;
            }

        }

        console.log('Processed Data:');
        console.dir(processedData);

        console.log('Fully Processed Data:');
        console.dir(fullyProcessedData);

        return processedData;
    }

    isotype.width = function(w) {
        width = w;
        return isotype;
    };

    isotype.height = function(h) {
        height = h;
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

    /**
     * Calculates the Scale from the Raw Data
     * Returns nice Scales like 1:10000
     *
     * TODO: Test this with different Datasets
     *
     * @param {Array} data Raw Data Array
     *
     * @private
     */
    var calculateScale = function(data) {

        var valueArray = [];
        var scaleArray = isomatic.options.scaleArray;

        var scaleTemp = 0;
        var scale = 0;
        var columns = 0;

        for (var i = 0; i < data.length; i++) {

            var columnCounter = 0;
            var row = data[i];

            for (var obj in row) {
                if (columnCounter > 0) {
                    valueArray.push(row[obj]);
                }
                columnCounter += 1;
            }

            columns = columnCounter;

        }

        scaleTemp = d3.sum(valueArray) / isomatic.options.desiredTotalIcons;

        // Get the next bigger Scale from the Array
        for (var j = 0; j < scaleArray.length; j++) {

            if (scaleTemp <= scaleArray[j]) {

                if (scaleArray[j] - scaleTemp < scaleTemp - scaleArray[j - 1]) {
                    scale = isomatic.options.scaleArray[j];
                } else {
                    scale = isomatic.options.scaleArray[j - 1];
                }

                break;
            }
        }

        console.log('Calculated Scale: ' + scale + ' from ' + scaleTemp);

        return scale;
    };


    return isotype;
};
