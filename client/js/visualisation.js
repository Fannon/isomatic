/* jshint jquery:true, devel: true */
/* global isomatic, d3 */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

/**
 * PROBLEME - LÖSUNGSANSÄTZE
 *
 * Icons laden:
 *  * in HTML einbetten und pre-loaden. Anschließend mit d3.select in Variablen speichern
 *  -> per AJAX request nachladen, als DOM in Variable speichern (oder text)?
 *  -> in JSON Format als HTML-Text speichern und an einem Stück laden
 *
 * Icons einfärben:
 *  -> Icon SVG Inhalte in <g fill="#3DD35D"> Element speichern, dort Fill setzen (Was ist mit Stroke?)
 *
 * Isotype Grafiken generieren:
 *  * PROBLEM: .html() funktioniert bei SVG nicht. Polyfill innersvg.js kann das fixen. Aber ist das richter Ansatz?
 *  -> D3.js .enter verwenden und Datenstruktur für Isotypes via eigene Layoutmethode erstellen. (3 Ebenen)
 *  * D3.js .html() verwenden und Icon per for Schleife vervielfachen entsprechend der Value
 *  * Nur JavaScript / jQuery DOM Manipulation verwenden um SVG zu bauen. (D3.js dann noch nötig?)
 *
 * SVG-Export:
 *  -> Über Proxy Script (PHP) -> Funktioniert immer, benötigt allerdings Internetverbindung / WebServer
 *  * Über JavaScript btoa() Methode (Browser-Support ?)
 *
 * Layouting:
 *  * Icon SVG Größe über getBBox() bestimmen ?
 *  -> Icon SVG Größe im JSON Format mit angeben ?
 *  -> Icon skalieren und verschieben über Transformationsmatrix auf <g> Element. (Hilfsfunktion schreiben?)
 *
 * Problemfelder:
 *  * Externe Icons können auf alle möglichen Weisen aufgebaut sein, einiges davon kann das UI und die Grafik brechen.
 *  * D3.js kann pro Datensatz die Größe, Farbe, Inhalt von Elementen umsetzen, aber nicht die Anzahl.
 *
 * TODO: LISTE
 *  * Datenzugriff mit .population ist nicht generisch
 *  * Mehrspaltige Daten verwalten
 *
 */


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

    isomatic.vis.$graph = $('#graph');

    isomatic.vis.newVisualisation(isomatic.options.aspectRatio);

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
    isomatic.options.aspectRatio = aspectRatio;
    isomatic.options.width = isomatic.vis.$graph.width();
    isomatic.options.height = Math.round(isomatic.options.width / aspectRatio);

    // Sets height of the Drawing Area according to aspect ratio
    isomatic.vis.$graph.height(isomatic.options.height);
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
    var widthLeft = isomatic.options.width - (isomatic.data.meta.maxIconsPerRow * isomatic.options.iconHorizontalPadding) - 2 * isomatic.options.outerPadding;
    isomatic.data.meta.baseScale = widthLeft / (isomatic.data.meta.maxIconsPerRow * 32);

};


/**
 * Draws Isotype Graphic
 */
isomatic.vis.drawIsotype = function() {

    "use strict";
    console.log('isomatic.vis.drawIsotype();');


    ///////////////////////////////////////
    // Visualisation Options             //
    ///////////////////////////////////////

    // Set Visualisation Options
    isomatic.vis.isotypeLayout = d3.layout.isotype()
        .roundDown(isomatic.options.roundDown)
        .roundUp(isomatic.options.roundUp)
        .scale(isomatic.options.scale)
    ;

    ///////////////////////////////////////
    // Create SVG Container              //
    ///////////////////////////////////////

    isomatic.vis.svg = d3.select("#graph").append("svg")
        .attr("width", isomatic.options.width)
        .attr("height", isomatic.options.height)
        .append("g")
        .attr("transform", "translate(" + isomatic.options.outerPadding / 2 + "," + isomatic.options.outerPadding / 2 + ")")
        .attr("id", "isotype")
    ;

    ///////////////////////////////////////
    // Draw Data                         //
    ///////////////////////////////////////

    if (isomatic.data.raw) {

        console.log('-> Drawing Data to Canvas: (TODO)');

        // Generate Layout
        isomatic.vis.isotypeLayout(isomatic.data.raw);

        // Precalculate Layout and save it into the Metadata Object.
        isomatic.vis.precalculate();


        // TODO: Choose different Icon via the isomatic.options.rowMap Array

        // TODO: Line Return if overflowing on the right side
        // TODO: Warning if overflowing on the bottom

        // Use SVG Circles:
//        var g = isomatic.vis.svg.selectAll(".icon")
//            .data(isomatic.vis.isotypeLayout(isomatic.data.raw))
//            .enter()
//                .append("circle")
//                .attr("class", "icon")
//                .attr("cx", function(d) {
//                    return d.pos * (r * 2 + isomatic.options.iconHorizontalPadding) + isomatic.options.outerPadding + r;
//                })
//                .attr("cy", function(d) {
//                    return d.row * (r * 2 + isomatic.options.iconVerticalPadding) + isomatic.options.outerPadding + r;
//                })
//                .attr("r", function(d) {
//                    return r * d.size;
//                })
//                .attr("fill", function(d) {
//                    return isomatic.options.columnMap[d.col];
//                })
//        ;

        var g = isomatic.vis.svg.selectAll(".icon")
                .data(isomatic.data.processed)
                .enter()
                .append("g")
                .attr("class", "icon")
                .attr("transform", function(d) {

                    var finalSize = isomatic.data.meta.baseScale * isomatic.options.defaultIconSize;

                    var x = d.pos * (finalSize + isomatic.options.iconHorizontalPadding) + isomatic.options.outerPadding;
                    var y = d.row * (finalSize + isomatic.options.iconVerticalPadding) + isomatic.options.outerPadding;

                    var scale = isomatic.data.meta.baseScale * d.size;

                    // If Icon is drawn smaller than full-size, center it
                    if (d.size < 1) {
                        console.log('Centering Icon');
                        x += (finalSize / 2) * (1 - d.size);
                        y += (finalSize / 2) * (1 - d.size);
                    }

                    return 'translate(' + x + ', ' + y + ') scale(' + scale + ')';

                })
                .html(function(d) {

                    var category, name;

                    if (isomatic.options.iconize === 'row') {
                        category = isomatic.options.iconMap[d.row].category;
                        name = isomatic.options.iconMap[d.row].name;
                    } else {
                        category = isomatic.options.iconMap[d.col - 1].category;
                        name = isomatic.options.iconMap[d.col - 1].name;
                    }


                    return isomatic.icons[category].icons[name].svg;
                })
                .attr("fill", function(d) {
                    if (isomatic.options.colorize === 'row') {
                        return isomatic.options.colorMap[d.row];
                    } else {
                        return isomatic.options.colorMap[d.col];
                    }
                })
            ;

        // TODO: Insert Text (Legend). Needs its own Layout?

        var legendText = '1 : ' + isomatic.vis.printScale(isomatic.options.scale);

        var legend = isomatic.vis.svg.append("g")
            .style("text-anchor", "start")
            .attr("transform", "translate(" + isomatic.options.outerPadding + ", " + (isomatic.options.height - 2 * isomatic.options.outerPadding) + ")");

        legend.append("text")
            .attr("class", "legend")
            .text(legendText)
            .attr("fill", "#999999")
        ;

    } else {
        isomatic.message('error', 'No Data loaded!');
    }

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

