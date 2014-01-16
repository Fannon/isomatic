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

        },

        /**
         * Render Graph Element
         */
        render: function(){
            this.$el.html('<div id="graph"></div>');

            this.newVisualisation();
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

            var aspectRatio = isomatic.options.ui.get('aspectRatio');
            var width = this.$display.width();
            var height = Math.round(width / aspectRatio);

            // Calculate Width and Height from Aspect Ratio
            isomatic.options.ui.set({
                aspectRatio: aspectRatio,
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
            var widthLeft = isomatic.options.ui.get('graphWidth') -
                (maxIconsPerRow * isomatic.options.ui.get("iconHorizontalMargin")) -
                2 * isomatic.options.ui.get("outerMargin");

            var baseScale = widthLeft / (maxIconsPerRow * 32);

            isomatic.data.meta.set({
                iconsPerRow: iconsPerRow,
                maxIconsPerRow: maxIconsPerRow,
                baseScale: baseScale
            });
        },

        /**
         * Calculates the Layout and stores it into isomatic.data.processed
         *
         * Constructs a new isotypeLayout, applies current Options and calculates the Layout
         */
        layout: function() {

            // Set Layouting Options

            this.isotypeLayout = new d3.layout.isotype();

            this.isotypeLayout.roundDown(isomatic.options.ui.get("roundDown"))
                .roundUp(isomatic.options.ui.get("roundUp"))
                .scale(isomatic.options.ui.get("scale"))
            ;

            isomatic.data.processed = this.isotypeLayout(isomatic.data.raw);

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
                .attr("width", isomatic.options.ui.attributes.graphWidth)
                .attr("height", isomatic.options.ui.attributes.graphHeight)
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

            var finalSize = isomatic.data.meta.attributes.baseScale * isomatic.options.internal.defaultIconSize;

            var g = this.svg.selectAll(".icon")

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
                    if (y > isomatic.options.ui.attributes.graphHeight || x > isomatic.options.ui.attributes.graphWidth) {
                        // isomatic.message('warning', '<strong>Warning: </strong>The generated Graphic is bigger than its Canvas!');
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
                .attr("transform", "translate(" + isomatic.options.ui.get("outerMargin") + ", " + (isomatic.options.ui.attributes.graphHeight - 2 * isomatic.options.ui.get("outerMargin")) + ")");

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
            return scale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    });

}(isomatic));

