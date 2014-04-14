/* jshint jquery:true, devel: true */
/* global isomatic, d3 */

/**
 * Isotype Layout
 * 2013 Simon Heimler
 *
 * TODO: Write Description
 *
 * @returns {Function}
 */
d3.layout.isotype = function() {
    "use strict";

    /**
     * This is the scale how much one icon represents.
     * Warning: This must be adjusted to the incoming data, otherwise it can lead to massive overload.
     *
     * @type {number}
     */
    var scale = 1;

    /**
     * If the remainder of a value is lower than this, the value is completely floored.
     * This helps avoiding too small icons.
     *
     * @type {number}
     */
    var roundDown = 0.5;

    /**
     * If the remainder of a value is higher than this, the value is completely ceiled.
     *
     * @type {number}
     */
    var roundUp = 0.5;

    /**
     * Isotype Layout
     * 2013-2014 Simon Heimler
     *
     * @param data Incoming (raw) Data
     * @returns {Array} Processed Data
     */
    function isotype(data) {

        /**
         * Processed Data with an Item per rendered Icon
         * @type {Array}
         */
        var processedData = [];


        ///////////////////////////////////////
        // Calculating Layout                //
        ///////////////////////////////////////

        // Iterate over Rows
        for (var rowCounter = 0; rowCounter < data.length; rowCounter++) {

            var columnCounter = 0;
            var iconPosition = 0;
            var currentRow = data[rowCounter];

            // Iterate over Columns
            for (var obj in currentRow) {

                if(currentRow.hasOwnProperty(obj)){

                    var v = currentRow[obj];

                    if (columnCounter > 0) {


                        ///////////////////////////////////////////
                        // Round the Value according to Options  //
                        ///////////////////////////////////////////

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


                        ///////////////////////////////////////////
                        // Calculate  Processed Data             //
                        ///////////////////////////////////////////

                        // Iterate over Icons
                        for (var relativePos = 0; relativePos < Math.ceil(value); relativePos++) {

                            // Calculate Size
                            var size = 1;
                            if (relativePos === Math.ceil(value) - 1 && value % 1 !== 0) {
                                size = value % 1;
                            }

                            processedData.push({
                                row: rowCounter,
                                col: columnCounter - 1,
                                pos: iconPosition,
                                relativePos: relativePos,
                                size: size
                            });

                            iconPosition += 1;
                        }
                    }

                    columnCounter += 1;
                }
            }

        }
        return processedData;
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
