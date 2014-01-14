/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _ */

/**
 * Graph View
 *
 * @type {*|void|Object}
 */
isomatic.views.GraphView = Backbone.View.extend({

    /**
     * Init Graph
     */
    initialize: function(){
        "use strict";

        // Cache jQuery Selectors
        this.$display = $('#display');
        this.$sidebar = $('#sidebar');

        this.render();

        // TODO: Refresh Graphic Method & Refresh Data Method

        this.newVisualisation(isomatic.options.ui.get("aspectRatio"));

    },

    /**
     * Render Graph Element
     */
    render: function(){
        "use strict";
        this.$el.html('<div id="graph"></div>');
    },

    /**
     * Manage Events
     */
    events: {
        "click #graph": "graphClick"
    },

    /**
     * If the graph is clicked, close all Overlays
     */
    graphClick: function() {
        "use strict";
        window.location = '#home';
    },

    /**
     * Creates a new Visualisation
     */
   newVisualisation: function(aspectRatio) {
        "use strict";

        console.log('GraphView.newVisualisation(' + aspectRatio + ');');

        // Calculate Width and Height from Aspect Ratio
        isomatic.options.ui.set("aspectRatio", aspectRatio);
        isomatic.data.meta.attributes.width = this.$display.width();
        isomatic.data.meta.attributes.height = Math.round(isomatic.data.meta.attributes.width / aspectRatio);

        // Sets height of the Drawing Area according to aspect ratio
        this.$display.height(isomatic.data.meta.attributes.height);
        this.$sidebar.height(isomatic.data.meta.attributes.height);

    },

    /**
     * Precalculates the visual Layout. Recommends some options like Icon-Size.
     * Stores the data into the isomatic.data.meta.attributes Object
     */
   precalculate: function() {
        "use strict";

        console.log('GraphView.precalculate();');

        var iconsPerRow = [];

        for (var i = 0; i < isomatic.data.processed.length; i++) {

            var obj = isomatic.data.processed[i];

            if (!iconsPerRow[obj.row]) {
                iconsPerRow[obj.row] = 1;
            } else {
                iconsPerRow[obj.row] += 1;
            }

        }

        isomatic.data.meta.attributes.iconsPerRow = iconsPerRow;
        isomatic.data.meta.attributes.maxIconsPerRow = d3.max(iconsPerRow);

        // Calculate Base Scale for Icons depending on biggest Row. (Fit to width)
        var widthLeft = isomatic.data.meta.attributes.width -
            (isomatic.data.meta.attributes.maxIconsPerRow * isomatic.options.ui.get("iconHorizontalMargin")) -
            2 * isomatic.options.ui.get("outerMargin");
        isomatic.data.meta.attributes.baseScale = widthLeft / (isomatic.data.meta.attributes.maxIconsPerRow * 32);

    },

    /**
     * Prepares the Drawing
     * Creates and prepares SVG Canvas
     * Creates and prepares the Isotype Layout
     */
   prepareDrawing: function() {
        "use strict";

        console.log('GraphView.prepareDrawing();');

        $('#graph').html('');

        ///////////////////////////////////////
        // Visualisation Options             //
        ///////////////////////////////////////

        // Set Visualisation Options
       this.isotypeLayout = d3.layout.isotype()
            .roundDown(isomatic.options.ui.get("roundDown"))
            .roundUp(isomatic.options.ui.get("roundUp"))
            .scale(isomatic.options.ui.get("scale"))
        ;

        ///////////////////////////////////////
        // Create SVG Container              //
        ///////////////////////////////////////

       this.svg = d3.select("#graph").append("svg")
            .attr("width",isomatic.data.meta.attributes.width)
            .attr("height", isomatic.data.meta.attributes.height)
            .append("g")
            .attr("id", "isotype")
        ;
    },

    /**
     * Draws Isotype Graphic
     *
     * TODO: Line Return if overflowing on the right side
     */
   drawIsotype: function() {

        "use strict";
        console.log('GraphView.drawIsotype();');

        ///////////////////////////////////////
        // Draw Data                         //
        ///////////////////////////////////////

        if (isomatic.data.raw) {

            var finalSize = isomatic.data.meta.attributes.baseScale * isomatic.options.internal.defaultIconSize;

            var g =this.svg.selectAll(".icon")
                .data(isomatic.data.processed)
                .enter()
                .append("g")
                .attr("class", "icon")
                .attr("transform", function(d) {

                    var x = d.pos * (finalSize + isomatic.options.ui.get("iconHorizontalMargin")) + isomatic.options.ui.get("outerMargin");
                    var y = d.row * (finalSize + isomatic.options.ui.get("rowMargin")) + isomatic.options.ui.get("outerMargin");

                    var scale = isomatic.data.meta.attributes.baseScale * d.size;

                    // If Icon is drawn smaller than full-size, center it
                    if (d.size < 1) {
                        x += (finalSize / 2) * (1 - d.size);
                        y += (finalSize / 2) * (1 - d.size);
                    }

                    // If Icon is drawn outside of Canvas give a warning
                    if (y > isomatic.data.meta.attributes.height || x >isomatic.data.meta.attributes.width) {
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
                        return isomatic.options.ui.get("colorMap")[d.col - 1];
                    }
                })
            ;

        } else {
            isomatic.message('error', 'No Data loaded!');
        }

    },

    /**
     * Draws Legend Overlay
     * TODO: Not completely implemented yet
     */
   drawLegend: function() {
        "use strict";

        console.log('GraphView.drawLegend();');

        var legendText = '1 : ' +this.printScale(isomatic.options.ui.get("scale"));

        var legend =this.svg.append("g")
            .style("text-anchor", "start")
            .attr("transform", "translate(" + isomatic.options.ui.get("outerMargin") + ", " + (isomatic.data.meta.attributes.height - 2 * isomatic.options.ui.get("outerMargin")) + ")");

        legend.append("text")
            .attr("class", "legend")
            .text(legendText)
            .attr("fill", "#999999")
        ;
    },

    /**
     * Pretty prints the Scale (for use with the Legend and the UI)
     *
     * http://stackoverflow.com/a/2901298/776425
     *
     * @param scale
     * @returns {string}
     */
   printScale: function(scale) {
        "use strict";
        return scale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

});
