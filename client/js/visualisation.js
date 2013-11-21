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
    isomatic.vis.newVisualisation(16 / 7);

    // Sets the Data, starts drawing on the Callback. TODO: This belongs into the UI
    isomatic.vis.loadData("data/data2.csv", function() {

        // Draw after Data is loaded (asynchronous)
        isomatic.vis.drawIsotype();

    });


});


///////////////////////////////////////
// Visualisation Functions           //
///////////////////////////////////////

/**
 * Creates a new Visualisation
 *
 * TODO: Clear current Canvas
 */
isomatic.vis.newVisualisation = function(aspectRatio) {
    "use strict";

    // Calculate Width and Height from Aspect Ratio
    isomatic.options.aspectRatio = aspectRatio;
    isomatic.options.width = isomatic.vis.$graph.width();
    isomatic.options.height = Math.round(isomatic.options.width / aspectRatio);

    // Sets height of the Drawing Area according to aspect ratio
    isomatic.vis.$graph.height(isomatic.options.height);
};


/**
 * Sets the Data Object
 *
 * TODO: Should support tsv and json too.
 * TODO: Imports just Files right now. Should use Object from UI
 */
isomatic.vis.loadData = function(filename, callback) {

    "use strict";

    d3.csv(filename, function(error, data) {

        if (error) {
            console.dir(error);
            isomatic.message('error', 'Error while loading Data!');
        } else {

            isomatic.data = data;
            console.log('Raw Data loaded from CVS:');
            console.dir(data);
        }

        callback();

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

    // TODO: Set Visualisation Options (Use Layout for this)
    isomatic.vis.isotypeLayout = d3.layout.isotype()
        .width(isomatic.options.width)
        .height(isomatic.options.width)
    ;

    isomatic.vis.isotypeLayout(isomatic.data);


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

    if (isomatic.data) {

        // TODO: Draw Data to Canvas
        return false;

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

    $.get(url, function(response) {
        isomatic.vis.icons[filename] = response.getElementsByTagName('svg')[0];
        // TODO: Icon Processing
    });

};


