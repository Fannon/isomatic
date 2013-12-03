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
// On DOM Ready                      //
///////////////////////////////////////

$(function() {

    "use strict";

    isomatic.vis.init();

    // Sets the Data, starts drawing on the Callback. TODO: This belongs into the UI
    isomatic.data.load("data/data2.csv", function(data) {

        // Init Foundation JavaScript
        $(document).foundation();

        // Init UI
        isomatic.ui.init();

        // Analyze Data
        isomatic.data.analyze(data);

        // Prepare Drawing
        isomatic.vis.prepareDrawing();

        // Generate Layout
        isomatic.data.processed = isomatic.vis.isotypeLayout(isomatic.data.raw);
        console.dir(isomatic.data.processed);

        // Precalculate Layout and save it into the Metadata Object.
        isomatic.vis.precalculate();

        // Draw Isotype Graphic
        isomatic.vis.drawIsotype();

        // Draw Legend Overlay
        isomatic.vis.drawLegend();

    });

});


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
    $('#message').append('<div class="alert alert-' + type + '">' + msg + '</div>');
    console.log('Message [' + type + ']: ' + msg);
};

/**
 * Returns a YYYY-MM-DD_-_HH-MM-SS formatted DateString
 * @return {String} formatted Date String
 */
isomatic.getFormattedTime = function() {
    "use strict";

    console.log('isomatic.getFormattedTime();');

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
