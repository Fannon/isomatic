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

/** Loaded Icons Puffer */
isomatic.vis.icons = {};

// TODO: Hardcoded Options:
isomatic.vis.options.iconRatio = 1000000;
isomatic.vis.options.roundDown = 0.2;
isomatic.vis.options.roundUp = 0.8;

isomatic.vis.options.outerPadding = 10;

// TODO: Test SVG
var billigSvg = '<g id="billigSVG"><path d="M49.752,37.132c-1.355,1.276-3.019,2.219-4.869,2.711c1.734,2.747,2.919,5.888,3.356,9.287c0.084,0.656-0.037,1.293-0.316,1.87h9.52c0.305,0,0.603-0.139,0.815-0.382c0.203-0.23,0.299-0.525,0.263-0.807C57.819,44.341,54.38,39.67,49.752,37.132z"/><path d="M38.772,33.381c0.381,0.271,0.747,0.56,1.11,0.853c0.364,0.294,0.724,0.593,1.069,0.909c0.981,0.897,1.885,1.877,2.7,2.933c1.541-0.281,2.951-0.938,4.131-1.876c0.297-0.236,0.581-0.485,0.847-0.754c0.249-0.252,0.479-0.521,0.698-0.799c1.256-1.595,2.012-3.6,2.012-5.783c0-5.167-4.204-9.371-9.371-9.371c-1.086,0-2.125,0.195-3.096,0.537c0.339,1.194,0.532,2.449,0.532,3.75c0,3.099-1.04,5.953-2.773,8.257C37.369,32.449,38.086,32.892,38.772,33.381z"/><path d="M24.745,51h1.75h18.199c0.476,0,0.922-0.198,1.226-0.542c0.266-0.302,0.385-0.683,0.334-1.073c-0.436-3.401-1.691-6.519-3.531-9.187c-0.226-0.327-0.456-0.651-0.699-0.964c-0.279-0.358-0.576-0.7-0.876-1.039c-0.861-0.971-1.806-1.861-2.829-2.656c-0.35-0.272-0.71-0.53-1.077-0.779c-0.358-0.244-0.717-0.484-1.09-0.705c-0.279-0.166-0.567-0.318-0.855-0.471c-0.283,0.28-0.577,0.548-0.883,0.803c-0.257,0.213-0.528,0.409-0.8,0.604c-0.27,0.193-0.549,0.374-0.833,0.547c-0.136,0.083-0.269,0.17-0.408,0.248c-0.042,0.024-0.081,0.052-0.123,0.075c-1.969,1.085-4.228,1.706-6.631,1.706c-3.77,0-7.188-1.524-9.679-3.984c-5.818,3.091-10.067,8.867-10.956,15.795c-0.051,0.392,0.069,0.775,0.338,1.081C5.624,50.802,6.07,51,6.543,51h17.094H24.745z"/><path d="M17.122,31.926c0.247,0.257,0.506,0.502,0.775,0.736c2.071,1.803,4.767,2.903,7.722,2.903c2.248,0,4.344-0.644,6.134-1.741c0.287-0.176,0.565-0.363,0.835-0.562c0.259-0.191,0.511-0.389,0.753-0.6c0.016-0.014,0.032-0.03,0.048-0.044c0.251-0.221,0.495-0.45,0.726-0.692c0.245-0.256,0.48-0.52,0.702-0.797c1.615-2.017,2.588-4.57,2.588-7.35c0-0.991-0.136-1.948-0.368-2.869c-0.085-0.337-0.182-0.668-0.295-0.993c-0.111-0.319-0.233-0.633-0.37-0.94c-1.843-4.11-5.965-6.984-10.753-6.984c-6.498,0-11.785,5.287-11.785,11.786c0,2.779,0.972,5.332,2.587,7.349C16.642,31.406,16.877,31.67,17.122,31.926z"/></g>';


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


    ///////////////////////////////////////
    // Init                              //
    ///////////////////////////////////////

    // TODO: Refactoring
    isomatic.vis.newVisualisation(16 / 9);

    // Preload 3 Icons // TODO: Refactoring
    isomatic.vis.loadIcon('add', 'icons/addition1.svg');
    isomatic.vis.loadIcon('coffee', 'icons/black168.svg');
    isomatic.vis.loadIcon('cellphone', 'icons/cellphone3.svg');


    // Sets the Data, starts drawing on the Callback. TODO: This belongs into the UI
    isomatic.vis.setData("data/data.csv", function() {

        isomatic.vis.drawIsotype();





        ///////////////////////////////////////
        // PLAYGROUND                        //
        ///////////////////////////////////////




        // Resizing and moving Icon by Transformation Matrix TEST

        var node = document.getElementById("g1");
        var bb = node.getBBox();
        console.dir(bb);

        var width=70, height=70;

        var x = 200;
        var y = -10;

        var widthRatio = 0;
        var heightRatio = 0;

        var ratio = 0;


        if (bb.width > bb.height) {
            widthRatio = width / bb.width;
            heightRatio = widthRatio;
        } else {
            heightRatio = height / bb.height;
            widthRatio = heightRatio;
        }

        // Changing Color of Icon
        node.setAttribute('fill', '#CC5F5F');



        var matrix = "matrix(" + widthRatio + ", 0, 0, " + heightRatio + "," + x + "," + y + ")";
        node.setAttribute("transform", matrix);


        // Icon TEST
        var svg = isomatic.vis.icons.coffee;
        svg.setAttribute('x', '15px');
        svg.setAttribute('y', '5px');

        // Set Icon Color (not very flexible approach)
        svg.childNodes[1].setAttribute('fill', '#6B486B');

        $('#graph svg').append(svg);

        // INSERT TEST
        // Update…
        var p = d3.select("#playground").selectAll("p")
            .data(isomatic.vis.data);

        // Enter…
        p.enter()
            .append("p")
            .html(function(d, index) {
                var html = index + ': ';
                for (var i = 0; i < d.population; i++) {
                    html += 'O';
                }
                return html;
            }
        );

    });


});


///////////////////////////////////////
// Visualisation Functions           //
///////////////////////////////////////

/**
 * Creates a new Visualisation
 * Empties the Drawing Area
 */
isomatic.vis.newVisualisation = function(aspectRatio) {
    "use strict";

    // Calculate Width and Height from Aspect Ratio
    isomatic.vis.options.aspectRatio = aspectRatio;
    isomatic.vis.options.width = isomatic.vis.$graph.width();
    isomatic.vis.options.height = Math.round(isomatic.vis.options.width / aspectRatio);

    // Sets height of the Drawing Area according to aspect ratio
    isomatic.vis.$graph.height(isomatic.vis.options.height);
};


/**
 * Sets the Data Object
 * TODO: Imports just Files right now. Should use Object from UI
 */
isomatic.vis.setData = function(filename, callback) {

    "use strict";

    d3.csv(filename, function(error, data) {

        if (error) {
            console.dir(error);
            isomatic.message('error', 'Error while loading Data!');
        } else {

            isomatic.vis.rawData = data;

            isomatic.vis.processData();

            isomatic.vis.data = data;
            console.log('DATA loaded.');
            console.dir(data);
        }

        callback();

    });
};

/**
 * Processing RawData into data according to current options
 */
isomatic.vis.processData = function() {
    "use strict";

    isomatic.vis.data = isomatic.vis.rawData;

    isomatic.vis.data.forEach(function(d) {

        // Calculation Ratio
        var population = d.population / isomatic.vis.options.iconRatio;

        // Round the Number according to the options
        var roundedPopulation = Math.floor(population);
        var leftOver = population % 1;

        if (leftOver > isomatic.vis.options.roundDown && leftOver < isomatic.vis.options.roundUp) {
            d.population = roundedPopulation + leftOver;
        } else {
            d.population = roundedPopulation;
        }

    });

};

/**
 * Draws Isotype Graphic
 */
isomatic.vis.drawIsotype = function() {

    "use strict";
    console.log('drawIsotype();');


    ///////////////////////////////////////
    // Visualisation Options             //
    ///////////////////////////////////////

    var radius = Math.min(isomatic.vis.options.width, isomatic.vis.options.height) / 2;

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


    ///////////////////////////////////////
    // Create SVG Container              //
    ///////////////////////////////////////

    isomatic.vis.svg = d3.select("#graph").append("svg")
        .attr("width", isomatic.vis.options.width)
        .attr("height", isomatic.vis.options.height)
        .append("g")
        .attr("transform", "translate(" + isomatic.vis.options.outerPadding / 2 + "," + isomatic.vis.options.outerPadding / 2 + ")")
        .attr("id", "isotype")
    ;


    ///////////////////////////////////////
    // Draw Data                         //
    ///////////////////////////////////////

    if (isomatic.vis.data) {

        // Row Group
        var g = isomatic.vis.svg.selectAll(".arc")
            .data(pie(isomatic.vis.data))
            .enter()
                .append("g")
                .attr("class", "arc")
                .attr("y", function(d, i) {
                    return i * 70 + 'px';
                })
                .attr("width", "500px")
                .attr("height", "64px")
        ;


        g.insert("g")
            .attr("width", "500px")
            .attr("height", "64px")
            .attr("x", function(d, i) {
                return i * 70 + 'px';
            })
            .html(function(d, i) {
                var html = '';
                for (var j = 0; j < d.population; j++) {
                    html += '<rect width="10" height="10" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/>';
                }
                return html;
            })
        ;

//        g.insert("rect")
//            .attr("width", "64px")
//            .attr("height", "64px")
//            .attr("x", function(d, i) {
//                return i * 70 + 'px';
//            })
//            .attr("style", "fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)")
//        ;

//        <rect width="300" height="100"
//        style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/>

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) {
                return color(d.data.age);
            })
            .style("stroke", '#FFFFFF');

        g.append("text")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .attr("fill", "#FFFFFF")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.age;
            });

    } else {
        isomatic.message('error', 'No Data loaded!');
    }

};

/**
 * Loads Icon from /icons/ directory into the icons Object
 * @param filename
 * @param url
 */
isomatic.vis.loadIcon = function(filename, url) {
    "use strict";

    $.get(url, function(response) {
        isomatic.vis.icons[filename] = response.getElementsByTagName('svg')[0];
    });

};

///////////////////////////////////////
// Export Functions                  //
///////////////////////////////////////

/**
 * Exports current Graphic as SVG
 * Embeds current Options and Data, too.
 */
isomatic.vis.exportSVG = function() {
    "use strict";

    isomatic.vis.embedData();

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
        data: isomatic.vis.rawData,
        options: isomatic.vis.options
    };

    var jsonStringExport = JSON.stringify(jsonExport, null, 2);

    isomatic.vis.svg.append("desc")
        .attr("id", "isomatic-metadata")
        .text(jsonStringExport);

    return jsonStringExport;
};


///////////////////////////////////////
// 3rd Party Scripts                 //
///////////////////////////////////////

/**
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
