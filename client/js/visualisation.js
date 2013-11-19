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
 *  * per AJAX request nachladen, als DOM in Variable speichern (oder text)?
 *  * in JSON Format als HTML-Text speichern und an einem Stück laden
 *
 * Icons einfärben:
 *  * Icon SVG Inhalte in <g> Element speichern, dort Fill setzen (Was ist mit Stroke?)
 *
 * Isotype Grafiken generieren:
 *  * PROBLEM: .html() funktioniert bei SVG nicht. Polyfill innersvg.js kann das fixen. Aber ist das richter Ansatz?
 *  * D3.js .enter verwenden und Datenstruktur für Isotypes via eigene Layoutmethode erstellen. (3 Ebenen)
 *  * D3.js .html() verwenden und Icon per for Schleife vervielfachen entsprechend der Value
 *  * Nur JavaScript / jQuery DOM Manipulation verwenden um SVG zu bauen. (D3.js dann noch nötig?)
 *
 * SVG-Export:
 *  * Über Proxy Script (PHP) -> Funktioniert immer, benötigt allerdings Internetverbindung / WebServer
 *  * Über JavaScript btoa() Methode (Browser-Support ?)
 *
 * Layouting:
 *  * Icon SVG Größe über getBBox() bestimmen ?
 *  * Icon SVG Größe im JSON Format mit angeben ?
 *  * Margin zwischen Icons festlegen
 *  * Margin zwischen Zeilen festlegen
 *  * Margin zum Rand festlegen
 *  * Margin zum Text festlegen
 *
 * Problemfelder:
 *  * Externe Icons können auf alle möglichen Weisen aufgebaut sein, einiges davon kann das UI und die Grafik brechen.
 *  * D3.js kann pro Datensatz die Größe, Farbe, Inhalt von Elementen umsetzen, aber nicht die Anzahl.
 *
 * TODO: LISTE
 * * Datenzugriff mit .population ist nicht generisch
 * * Mehrspaltige Daten verwalten
 * * Alternativen zu D3.js?
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

/** isomatic Visualisation current options */
isomatic.vis.options = {};

/** Loaded Icons Puffer */
isomatic.vis.icons = {};

// TODO: Hardcoded Options:
isomatic.vis.options.iconRatio = 1000000;
isomatic.vis.options.roundDown = 0.2;
isomatic.vis.options.roundUp = 0.8;

isomatic.vis.options.outerPadding = 10;


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
            .data(isomatic.data);

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

            isomatic.rawData = data;

            isomatic.vis.processData();

            isomatic.data = data;
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

    isomatic.data = isomatic.rawData;

    isomatic.data.forEach(function(d) {

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

    if (isomatic.data) {

        // Row Group
        var g = isomatic.vis.svg.selectAll(".arc")
            .data(pie(isomatic.data))
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
        data: isomatic.rawData,
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
