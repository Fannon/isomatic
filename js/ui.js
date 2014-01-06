/* jshint jquery:true, devel: true */
/* global isomatic, _, backbone */


///////////////////////////////////////
// UI Variables                      //
///////////////////////////////////////

/**
 * isomatic Visualisation Namespace
 * Contains Functions and Model / Data
 *
 * @singleton
 */
isomatic.ui = {};


isomatic.ui.init = function() {
    "use strict";


    ///////////////////////////////////////
    // Overlay Event Listeners           //
    ///////////////////////////////////////

    // Overlay Buttons
    $('.trigger-ui').click(function(event) {

        event.preventDefault();

        var action = event.currentTarget.id.substring(3).toLowerCase();
        var url = location.href;
        location.href = "#" + action;

        // TODO: Refactor this to use Backbone Views and Events
        if($("#overlay-" + action).is(':visible') || $("#" + event.currentTarget.id).hasClass('active')) {
            $("#" + event.currentTarget.id).removeClass('active');
            $("#overlay-" + action).hide();
        } else {
            $(".overlay-container").hide();
            $(".trigger-ui").removeClass('active');

            $("#" + event.currentTarget.id).addClass('active');
            $("#overlay-" + action).show();
        }
    });

    // Import Data File Upload
    // TODO: Use Library? -> http://blueimp.github.io/jQuery-File-Upload/basic.html
    $( "#imported-file" ).change(function() {
        console.log('FILE UPLOAD START');
        console.dir(this.files[0]);
    });

};


///////////////////////////////////////
// Export Functions                  //
///////////////////////////////////////

/**
 * Exports current Graphic as SVG
 * Embeds current Options and Data, too.
 */
isomatic.ui.exportSVG = function() {
    "use strict";

    console.log('isomatic.ui.exportSVG();');

    isomatic.ui.embedData();

    var content = '<?xml version="1.0" encoding="utf-8"?>\n';
    content += '<!-- Generator: isomatic (http://www.isomatic.de) -->\n';
    content += $('#graph').html();

    var filename = isomatic.getFormattedTime() + ".svg";

    $.generateFile({
        filename: filename,
        content: content,
        script: 'http://svg-generator.de/download.php'
    });

};

/**
 * Exports Options and Data as JSON Object
 */
isomatic.ui.exportJSON = function() {
    "use strict";

    console.log('isomatic.ui.exportJSON();');

    var content = isomatic.ui.embedData();
    var filename = isomatic.getFormattedTime() + ".json";

    $.generateFile({
        filename: filename,
        content: content,
        script: 'http://svg-generator.de/download.php'
    });
};

/**
 * Embeds current Options and Data into the SVG
 * Helper Function
 */
isomatic.ui.embedData = function() {
    "use strict";

    console.log('isomatic.ui.embedData();');

    var jsonExport = {
        data: isomatic.data.raw,
        options: isomatic.options.ui.toJSON()
    };

    var jsonStringExport = JSON.stringify(jsonExport, null, 2);

    // Check if description tag already exists. If not create it, otherwise update it.
    var desc = $('#isomatic-metadata');
    if (desc.length === 0) {
        isomatic.vis.svg.append("desc")
            .attr("id", "isomatic-metadata")
            .text(jsonStringExport);
    } else {
        desc.text(jsonStringExport);
    }

    return jsonStringExport;
};
