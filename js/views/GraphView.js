/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _ */

(function(isomatic) {
    "use strict";

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

            // Cache jQuery Selectors
            this.$display = $('#display');

            this.render();

            this.newVisualisation();

        },

        /**
         * Render Graph Element
         */
        render: function(){
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
            window.location = '#home';
        },

        /**
         * Creates a new Visualisation
         * Calculats Graph Canvas Size and sets UI Options and Appearance accordingly
         */
        newVisualisation: function() {

            console.log('GraphView.newVisualisation();');

            var aspectRatio = parseFloat(isomatic.options.ui.get('aspectRatio'));
            var width = this.$display.width();
            var height = Math.round(width / aspectRatio);

            // Calculate Width and Height from Aspect Ratio
            isomatic.options.ui.set({
                graphWidth: width,
                graphHeight: height
            });

            // Sets height of the Drawing Area according to aspect ratio
            this.$display.height(height);

        },

        /**
         * Precalculates the visual Layout. Recommends some options like Icon-Size.
         * Stores the data into the isomatic.data.meta Model
         */
        precalculate: function() {

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

            var maxIconsPerRow = d3.max(iconsPerRow);

            // Calculate Base Scale for Icons depending on biggest Row. (Fit to width)
            var widthLeft = parseFloat(isomatic.options.ui.get('graphWidth')) -
                (maxIconsPerRow * parseFloat(isomatic.options.ui.get("iconHorizontalMargin"))) -
                2 * parseFloat(isomatic.options.ui.get("outerMargin"));

            var baseScale = widthLeft / (maxIconsPerRow * 32);

            var iconSize = baseScale * isomatic.options.internal.defaultIconSize;

            isomatic.data.meta.set({
                iconsPerRow: iconsPerRow,
                maxIconsPerRow: maxIconsPerRow,
                baseScale: baseScale
            });

            isomatic.options.ui.set({iconSize: iconSize});
        },

        /**
         * Calculates the Layout and stores it into isomatic.data.processed
         *
         * Constructs a new isotypeLayout, applies current Options and calculates the Layout
         */
        layout: function() {

            // Set Layouting Options

            this.isotypeLayout = new d3.layout.isotype();

            this.isotypeLayout.roundDown(parseFloat(isomatic.options.ui.get("roundDown")))
                .roundUp(parseFloat(isomatic.options.ui.get("roundUp")))
                .scale(parseFloat(isomatic.options.ui.get("scale")))
            ;

            isomatic.data.processed = this.isotypeLayout(isomatic.data.raw.get('data'));

        },

        /**
         * Prepares the Drawing
         * Creates and prepares SVG Canvas
         * Creates and prepares the Isotype Layout
         */
        prepareDrawing: function() {

            console.log('GraphView.prepareDrawing();');

            // Empty Canvas before Drawing
            $('#graph').html('');

            // Create new SVG Container for D3.js
            this.svg = d3.select("#graph").append("svg")
                .attr("width", parseInt(isomatic.options.ui.attributes.graphWidth, 10))
                .attr("height", parseInt(isomatic.options.ui.attributes.graphHeight, 10))
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

            console.log('GraphView.drawIsotype();');

            var finalSize = parseFloat(isomatic.data.meta.attributes.baseScale) * isomatic.options.internal.defaultIconSize;

            var g = this.svg.selectAll(".icon")

                .data(isomatic.data.processed)
                .enter()
                .append("g")
                .attr("class", "icon")
                .attr("transform", function(d) {

                    var x = d.pos * (finalSize + parseFloat(isomatic.options.ui.get("iconHorizontalMargin"))) + parseFloat(isomatic.options.ui.get("outerMargin"));
                    var y = d.row * (finalSize + parseFloat(isomatic.options.ui.get("rowMargin"))) + parseFloat(isomatic.options.ui.get("outerMargin"));

                    var scale = isomatic.data.meta.attributes.baseScale * d.size;

                    // If Icon is drawn smaller than full-size, center it
                    if (d.size < 1) {
                        x += (finalSize / 2) * (1 - d.size);
                        y += (finalSize / 2) * (1 - d.size);
                    }

                    // If Icon is drawn outside of Canvas give a warning
                    if (y > parseFloat(isomatic.options.ui.attributes.graphHeight) || x > parseFloat(isomatic.options.ui.attributes.graphWidth)) {
                        console.warn('<strong>Warning: </strong>The generated Graphic is bigger than its Canvas!');
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
                        return '#' + isomatic.options.ui.get("colorMap")[d.row];
                    } else {
                        return '#' + isomatic.options.ui.get("colorMap")[d.col - 1];
                    }
                })
            ;

        },

        /**
         * Draws Legend Overlay
         * TODO: Not completely implemented yet
         */
        drawLegend: function() {

            console.log('GraphView.drawLegend();');

            var legendText = '1 : ' + this.printScale(isomatic.options.ui.get("scale"));

            var legend = this.svg.append("g")
                .style("text-anchor", "start")
                .attr("transform", "translate(" + parseFloat(isomatic.options.ui.get("outerMargin")) + ", " + (parseFloat(isomatic.options.ui.attributes.graphHeight) - 2 * parseFloat(isomatic.options.ui.get("outerMargin"))) + ")");

            legend.append("text")
                .attr("class", "legend")
                .text(legendText)
                .attr("fill", "#999999")
            ;
        },

        ///////////////////////////////////
        // Helper Functions              //
        ///////////////////////////////////

        /**
         * Pretty prints the Scale (for use with the Legend and the UI)
         *
         * http://stackoverflow.com/a/2901298/776425
         *
         * @param scale
         * @returns {string}
         */
        printScale: function(scale) {
            return scale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    });

}(isomatic));

