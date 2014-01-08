/* jshint jquery:true, devel: true */
/* global isomatic, d3 */


///////////////////////////////////////
// Visualisation Variables           //
///////////////////////////////////////

/**
 * isomatic Visualisation Namespace
 * Contains Functions and Model / Data
 *
 * @singleton
 */
isomatic.vis = {};


///////////////////////////////////////
// Visualisation Functions           //
///////////////////////////////////////

/**
 * Initialize the Visualisation Module
 */
isomatic.vis.init = function() {
    "use strict";

    console.log('isomatic.vis.init();');

    isomatic.vis.$display = $('#display');
    isomatic.vis.$graph = $('#graph');
    isomatic.vis.$sidebar = $('#sidebar');

    isomatic.vis.newVisualisation(isomatic.options.ui.get("aspectRatio"));

};


/**
 * Creates a new Visualisation
 *
 * TODO: Clear current Canvas
 */
isomatic.vis.newVisualisation = function(aspectRatio) {
    "use strict";

    console.log('isomatic.vis.newVisualisation(' + aspectRatio + ');');

    // Calculate Width and Height from Aspect Ratio
    isomatic.options.ui.set("aspectRatio", aspectRatio);
    isomatic.data.meta.width = isomatic.vis.$display.width();
    isomatic.data.meta.height = Math.round(isomatic.data.meta.width / aspectRatio);

    // Sets height of the Drawing Area according to aspect ratio
    isomatic.vis.$display.height(isomatic.data.meta.height);
    isomatic.vis.$sidebar.height(isomatic.data.meta.height);
};

/**
 * Precalculates the visual Layout. Recommends some options like Icon-Size.
 * Stores the data into the isomatic.data.meta Object
 */
isomatic.vis.precalculate = function() {
    "use strict";

    console.log('isomatic.vis.precalculate();');

    var iconsPerRow = [];

    for (var i = 0; i < isomatic.data.processed.length; i++) {

        var obj = isomatic.data.processed[i];

        if (!iconsPerRow[obj.row]) {
            iconsPerRow[obj.row] = 1;
        } else {
            iconsPerRow[obj.row] += 1;
        }

    }

    isomatic.data.meta.iconsPerRow = iconsPerRow;
    isomatic.data.meta.maxIconsPerRow = d3.max(iconsPerRow);

    // Calculate Base Scale for Icons depending on biggest Row. (Fit to width)
    var widthLeft = isomatic.data.meta.width -
        (isomatic.data.meta.maxIconsPerRow * isomatic.options.ui.get("iconHorizontalMargin")) -
        2 * isomatic.options.ui.get("outerMargin");
    isomatic.data.meta.baseScale = widthLeft / (isomatic.data.meta.maxIconsPerRow * 32);

};

/**
 * Prepares the Drawing
 * Creates and prepares SVG Canvas
 * Creates and prepares the Isotype Layout
 */
isomatic.vis.prepareDrawing = function() {
    "use strict";

    console.log('isomatic.vis.prepareDrawing();');

    $('#graph').html('');

    ///////////////////////////////////////
    // Visualisation Options             //
    ///////////////////////////////////////

    // Set Visualisation Options
    isomatic.vis.isotypeLayout = d3.layout.isotype()
        .roundDown(isomatic.options.ui.get("roundDown"))
        .roundUp(isomatic.options.ui.get("roundUp"))
        .scale(isomatic.options.ui.get("scale"))
    ;

    ///////////////////////////////////////
    // Create SVG Container              //
    ///////////////////////////////////////

    isomatic.vis.svg = d3.select("#graph").append("svg")
        .attr("width",isomatic.data.meta.width)
        .attr("height", isomatic.data.meta.height)
        .append("g")
        .attr("id", "isotype")
    ;
};

/**
 * Draws Isotype Graphic
 *
 * TODO: Line Return if overflowing on the right side
 */
isomatic.vis.drawIsotype = function() {

    "use strict";
    console.log('isomatic.vis.drawIsotype();');

    ///////////////////////////////////////
    // Draw Data                         //
    ///////////////////////////////////////

    if (isomatic.data.raw) {

        console.log('-> Drawing Data to Canvas: (TODO)');

        // Use SVG Circles instead of Icons:
//        var g = isomatic.vis.svg.selectAll(".icon")
//            .data(isomatic.vis.isotypeLayout(isomatic.data.raw))
//            .enter()
//                .append("circle")
//                .attr("class", "icon")
//                .attr("cx", function(d) {
//                    return d.pos * (r * 2 + isomatic.options.iconHorizontalMargin) + isomatic.options.outerMargin + r;
//                })
//                .attr("cy", function(d) {
//                    return d.row * (r * 2 + isomatic.options.iconVerticalMargin) + isomatic.options.outerMargin + r;
//                })
//                .attr("r", function(d) {
//                    return r * d.size;
//                })
//                .attr("fill", function(d) {
//                    return isomatic.options.columnMap[d.col];
//                })
//        ;

        var finalSize = isomatic.data.meta.baseScale * isomatic.options.internal.defaultIconSize;

        var g = isomatic.vis.svg.selectAll(".icon")
                .data(isomatic.data.processed)
                .enter()
                .append("g")
                .attr("class", "icon")
                .attr("transform", function(d) {

//                    var finalSizeX = isomatic.data.meta.baseScale * isomatic.options.defaultIconSize;

                    // TODO: Calculate X Size from defaultIcons.js

                    var x = d.pos * (finalSize + isomatic.options.ui.get("iconHorizontalMargin")) + isomatic.options.ui.get("outerMargin");
                    var y = d.row * (finalSize + isomatic.options.ui.get("rowMargin")) + isomatic.options.ui.get("outerMargin");

                    var scale = isomatic.data.meta.baseScale * d.size;

                    // If Icon is drawn smaller than full-size, center it
                    if (d.size < 1) {
                        x += (finalSize / 2) * (1 - d.size);
                        y += (finalSize / 2) * (1 - d.size);
                    }

                    // If Icon is drawn outside of Canvas give a warning
                    if (y > isomatic.data.meta.height || x >isomatic.data.meta.width) {
                        isomatic.message('warning', '<strong>Warning: </strong>The generated Graphic is bigger than its Canvas!');
                    }

                    return 'translate(' + x + ', ' + y + ') scale(' + scale + ')';

                })
                .html(function(d) {

                    var category, name;

                    if (isomatic.options.ui.get("iconize") === 'row') {
                        category = isomatic.options.ui.get("iconMap")[d.row].category;
                        name = isomatic.options.ui.get("iconMap")[d.row].name;
                    } else {
                        category = isomatic.options.ui.get("iconMap")[d.col - 1].category;
                        name = isomatic.options.ui.get("iconMap")[d.col - 1].name;
                    }

                    return isomatic.icons[category].icons[name].svg;
                })
                .attr("fill", function(d) {
                    if (isomatic.options.ui.get("colorize") === 'row') {
                        return isomatic.options.ui.get("colorMap")[d.row];
                    } else {
                        return isomatic.options.ui.get("colorMap")[d.col];
                    }
                })
            ;

    } else {
        isomatic.message('error', 'No Data loaded!');
    }

};

/**
 * Draws Legend Overlay
 */
isomatic.vis.drawLegend = function() {
    "use strict";

    console.log('isomatic.vis.drawLegend();');

    // TODO: Insert Text (Legend). Needs its own Layout?

    var legendText = '1 : ' + isomatic.vis.printScale(isomatic.options.ui.get("scale"));

    var legend = isomatic.vis.svg.append("g")
        .style("text-anchor", "start")
        .attr("transform", "translate(" + isomatic.options.ui.get("outerMargin") + ", " + (isomatic.data.meta.height - 2 * isomatic.options.ui.get("outerMargin")) + ")");

    legend.append("text")
        .attr("class", "legend")
        .text(legendText)
        .attr("fill", "#999999")
    ;
};

/**
 * Loads Icon from /icons/ directory into the icons Object
 * @param filename
 * @param url
 *
 * TODO: Refactor this into loading a Library instead of single icons
 */
isomatic.vis.loadIcon = function(filename, url) {
    "use strict";

    console.log('isomatic.vis.loadIcon(' + filename + ', ' + url + ');');

    $.get(url, function(response) {
        isomatic.vis.icons[filename] = response.getElementsByTagName('svg')[0];
        // TODO: Icon Processing
    });

};

/**
 * Pretty prints the Scale (for use with the Legend and the UI)
 *
 * http://stackoverflow.com/a/2901298/776425
 *
 * @param scale
 * @returns {string}
 */
isomatic.vis.printScale = function(scale) {
    "use strict";
    return scale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

