/* jshint jquery:true, devel: true */
/* global isomatic, d3 */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

/** Data Namespace */
isomatic.data = {};

/** Raw Data */
isomatic.data.raw = [];

/** Processed Data (after Layouting) */
isomatic.data.processed = [];

/** MetaData Informations */
isomatic.data.meta = {};

/** Minimum Value in Data */
isomatic.data.meta.min = 0;

/** Maximum Value in Data */
isomatic.data.meta.max = 0;

/** Sum of all Values in Data */
isomatic.data.meta.sum = 0;

/** Array of all Rows. Can be used to get the readable name of an Row ID */
isomatic.data.meta.rows = [];

/** Array of all Columns. Can be used to get the readable name of an Column ID */
isomatic.data.meta.columns = [];


/**
 * Loads and stores the Data Object
 *
 * TODO: Should support tsv and json too.
 * TODO: Imports just Files right now. Should use Object from UI
 */
isomatic.data.load = function(filename, callback) {
    "use strict";

    console.log('isomatic.data.load(' + filename + ', callback);');

    d3.csv(filename, function(error, data) {

        if (error) {
            console.dir(error);
            isomatic.message('error', 'Error while loading Data!');
        } else {

            isomatic.data.raw = data;
            console.log('Raw Data loaded from CVS:');
            console.dir(data);
        }

        callback(data);

    });
};

/**
 * Calculates the Scale from the Raw Data
 * Returns nice Scales like 1:10000
 *
 * @param {Array} data Raw Data Array
 */
isomatic.data.analyze = function(data) {
    "use strict";

    console.log('isomatic.data.analyze(data);');

    var values = [];
    var availableScales = [];


    ///////////////////////////////////////
    // Analyse Values, Rows and Columns  //
    ///////////////////////////////////////

    // Iterate over Rows
    for (var rowCounter = 0; rowCounter < data.length; rowCounter++) {

        var columnCounter = 0;
        var currentRow = data[rowCounter];

        // Iterate over Columns
        for (var obj in currentRow) {
            if(currentRow.hasOwnProperty(obj)){

                // Put all available Columns into an array
                if (rowCounter === 0) {
                    isomatic.data.meta.columns.push(obj);
                }

                if (columnCounter === 0) {
                    // Put first Column (Description) into a Column Array
                    isomatic.data.meta.rows.push(currentRow[obj]);
                } else {
                    values.push(currentRow[obj]);
                }

                columnCounter += 1;
            }
        }
    }

    isomatic.data.meta.min = d3.min(values);
    isomatic.data.meta.max = d3.max(values);
    isomatic.data.meta.sum = d3.sum(values);


    ///////////////////////////////////////
    // Calculate a recommended Scale     //
    ///////////////////////////////////////

    var scaleTemp = isomatic.data.meta.sum / isomatic.options.desiredTotalIcons;

    // Get the next bigger Scale from the Array
    // TODO: Check for Array Boundaries!
    for (var j = 0; j < isomatic.options.scaleArray.length; j++) {
        if (scaleTemp <= isomatic.options.scaleArray[j]) {
            if (isomatic.options.scaleArray[j] - scaleTemp < scaleTemp - isomatic.options.scaleArray[j - 1]) {
                availableScales = [
                    isomatic.options.scaleArray[j - 1],
                    isomatic.options.scaleArray[j],
                    isomatic.options.scaleArray[j + 1]
                ];
            } else {
                availableScales = [
                    isomatic.options.scaleArray[j - 2],
                    isomatic.options.scaleArray[j - 1],
                    isomatic.options.scaleArray[j]
                ];
            }
            break;
        }
    }

    console.log('-> Calculated Scale: ' + availableScales[1] + ' from ' + scaleTemp);

    isomatic.options.scale = availableScales[1]; // Use the Scale in the middle
    isomatic.options.availableScales = availableScales;

};
