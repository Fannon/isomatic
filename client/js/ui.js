/* jshint jquery:true, devel: true */
/* global isomatic, _, backbone */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////


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
        data: isomatic.rawData,
        options: isomatic.options
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
