/* jshint jquery:true, devel: true */
/* global isomatic, d3 */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

///////////////////////////////////////
// Visualisation Variables           //
///////////////////////////////////////



/** isomatic Visualisation Namespace */
isomatic.vis = {};

/** isomatic Visualisation current options */
isomatic.vis.options = {};


///////////////////////////////////////
// On DOM Ready                      //
///////////////////////////////////////

$(function() {

    "use strict";

    console.log('ISOMATIC INIT');

    ///////////////////////////////////////
    // Variables                         //
    ///////////////////////////////////////

    isomatic.vis.$graph = $('#graph');

    isomatic.vis.options.aspectRatio = 16/6;

    isomatic.vis.options.width = isomatic.vis.$graph.width();
    isomatic.vis.options.height = Math.round(isomatic.vis.options.width / isomatic.vis.options.aspectRatio);

    // TODO: Stub
    var radius = Math.min(isomatic.vis.options.width, isomatic.vis.options.height) / 2;


    ///////////////////////////////////////
    // Init UI                           //
    ///////////////////////////////////////

    // Sets height of the Drawing Area according to aspect ratio
    isomatic.vis.$graph.height(isomatic.vis.options.height);

    console.log('UI INIT');

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.population;
        });

    isomatic.vis.svg = d3.select("#graph").append("svg")
        .attr("width", isomatic.vis.options.width)
        .attr("height", isomatic.vis.options.height)
        .append("g")
        .attr("transform", "translate(" + isomatic.vis.options.width / 2 + "," + isomatic.vis.options.height / 2 + ")");

    d3.csv("data/data.csv", function(error, data) {

        isomatic.vis.data = data;

        console.dir(data);

        data.forEach(function(d) {
            d.population = +d.population;
        });

        var g = isomatic.vis.svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.age); })
            .style("stroke", "#FFFFFF");

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.age; });

        console.dir(g);

    });

});

/**
 * Exports current Graphic as SVG
 * Embeds current Options and Data, too.
 */
isomatic.vis.exportSVG = function() {
    "use strict";

    isomatic.vis.embedData();

    var content = $('#graph').html();
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
isomatic.vis.exportJSON = function() {
    "use strict";

    var content = isomatic.vis.embedData();
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
isomatic.vis.embedData = function() {
    "use strict";

    var jsonExport = {
        data: isomatic.vis.data,
        options: isomatic.vis.options
    };

    var jsonStringExport = JSON.stringify(jsonExport, null, 2);

    isomatic.vis.svg.append("desc")
        .attr("id", "isomatic-metadata")
        .text(jsonStringExport);

    return jsonStringExport;
};


///////////////////////////////////////
// General Helper Functions          //
///////////////////////////////////////

/**
 * Returns a DateString
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


///////////////////////////////////////
// 3rd Party Scripts                 //
///////////////////////////////////////

/**
 * http://tutorialzine.com/2011/05/generating-files-javascript-php/
 */
(function($){
    "use strict";


    // Creating a jQuery plugin:

    $.generateFile = function(options){

        options = options || {};

        if(!options.script || !options.filename || !options.content){
            throw new Error("Please enter all the required config options!");
        }

        // Creating a 1 by 1 px invisible iframe:

        var iframe = $('<iframe>',{
            width:1,
            height:1,
            frameborder:0,
            css:{
                display:'none'
            }
        }).appendTo('body');

        var formHTML = '<form action="" method="post">'+
            '<input type="hidden" name="filename" />'+
            '<input type="hidden" name="content" />'+
            '</form>';

        // Giving IE a chance to build the DOM in
        // the iframe with a short timeout:

        setTimeout(function(){

            // The body element of the iframe document:

            var body = (iframe.prop('contentDocument') !== undefined) ?
                iframe.prop('contentDocument').body :
                iframe.prop('document').body;	// IE

            body = $(body);

            // Adding the form to the body:
            body.html(formHTML);

            var form = body.find('form');

            form.attr('action',options.script);
            form.find('input[name=filename]').val(options.filename);
            form.find('input[name=content]').val(options.content);

            // Submitting the form to download.php. This will
            // cause the file download dialog box to appear.

            form.submit();
        },50);
    };

})(jQuery);
