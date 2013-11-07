/* jshint jquery:true, devel: true */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

///////////////////////////////////////
// Global Variables                  //
///////////////////////////////////////

/** global namespace */
var isomatic = {};




///////////////////////////////////////
// General Helper Functions          //
///////////////////////////////////////

/**
 * Returns a formatted DateString
 * @return {String}           [description]
 */
isomatic.getFormattedTime = function() {
    "use strict";

    var a = new Date();

    var year = a.getFullYear();
    var month = isomatic.pad(a.getMonth() + 1);
    var date = isomatic.pad(a.getDate());
    var hour = isomatic.pad(a.getHours());
    var min = isomatic.pad(a.getMinutes());
    var sec = isomatic.pad(a.getSeconds());

    return year + '-' + month + '-' + date + '_-_' + hour + ':' + min + ':' + sec;
};

/**
 * Pads a Number
 * @param n             Number to Pad
 * @returns {string}    Padded Number
 */
isomatic.pad = function(n) {
    "use strict";
    return n < 10 ? '0' + n : n;
};
