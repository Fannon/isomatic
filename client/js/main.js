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

/** isomatic current options */
isomatic.options = {};

// TODO: Hardcoded Options:
// UI Default Options
isomatic.options.roundDown = 0.2;
isomatic.options.roundUp = 0.8;
isomatic.options.outerPadding = 10;

// Auto-Layouting Options
isomatic.options.desiredTotalIcons = 64;
isomatic.options.scaleArray = [
    1, 2, 5,
    10, 20, 50,
    100, 200, 500,
    1000, 2000, 5000,
    10000, 20000, 50000,
    100000, 200000, 500000,
    1000000, 2000000, 5000000,
    10000000, 20000000, 50000000,
    100000000, 200000000, 500000000,
    1000000000, 2000000000, 5000000000,
    10000000000, 20000000000, 50000000000,
    100000000000, 200000000000, 500000000000,
    1000000000000, 2000000000000, 5000000000000
];


///////////////////////////////////////
// General Helper Functions          //
///////////////////////////////////////

/**
 * Displays Message to User
 * TODO: Integrate this into the UI
 *
 * @param {String}  type  Type of Message
 * @param {String}  msg   HTML Text of message
 */
isomatic.message = function(type, msg) {
    "use strict";
    console.log('Message [' + type + ']: ' + msg);
};

/**
 * Returns a YYYY-MM-DD_-_HH-MM-SS formatted DateString
 * @return {String} formatted Date String
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


///////////////////////////////////////
// 3rd Party Scripts                 //
///////////////////////////////////////

/**
 * jQuery Plugin to allow File Downloads from JavaScript Variables
 * http://tutorialzine.com/2011/05/generating-files-javascript-php/
 */
(function($) {
    "use strict";

    // Creating a jQuery plugin:
    $.generateFile = function(options) {

        options = options || {};

        if (!options.script || !options.filename || !options.content) {
            throw new Error("Please enter all the required config options!");
        }

        // Creating a 1 by 1 px invisible iframe:

        var iframe = $('<iframe>', {
            width: 1,
            height: 1,
            frameborder: 0,
            css: {
                display: 'none'
            }
        }).appendTo('body');

        var formHTML = '<form action="" method="post">' +
            '<input type="hidden" name="filename" />' +
            '<input type="hidden" name="content" />' +
            '</form>';

        // Giving IE a chance to build the DOM in
        // the iframe with a short timeout:

        setTimeout(function() {

            // The body element of the iframe document:

            var body = (iframe.prop('contentDocument') !== undefined) ?
                iframe.prop('contentDocument').body :
                iframe.prop('document').body;	// IE

            body = $(body);

            // Adding the form to the body:
            body.html(formHTML);

            var form = body.find('form');

            form.attr('action', options.script);
            form.find('input[name=filename]').val(options.filename);
            form.find('input[name=content]').val(options.content);

            // Submitting the form to download.php. This will
            // cause the file download dialog box to appear.

            form.submit();
        }, 50);
    };

})(jQuery);

