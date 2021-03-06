/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _ */

(function(isomatic) {
    "use strict";

    isomatic.views.GraphView = Backbone.View.extend( /** @lends GraphView.prototype */ {

        /**
         * Initializes the Graph View.
         *
         * The Graph View creates the Canvas for the Graphic
         * It has all the functions to layout and render the visualisation
         * based on the Data coming from the DataView.
         *
         * @class GraphView
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){

            // Cache jQuery Selectors
            this.$display = $('#display');

            this.render();

            this.newVisualisation();

        },

        /**
         * Render Graph Element
         *
         * Fill in just an empty graph div
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
         *
         * Calculates Graph Canvas Size and sets UI Options and Appearance accordingly
         */
        newVisualisation: function() {

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
        preCalculate: function() {

            ////////////////////////////////////
            // Get & Parse Variables          //
            ////////////////////////////////////

            var outerMargin          = parseFloat(isomatic.options.ui.attributes.outerMargin);
            var iconHorizontalMargin = parseFloat(isomatic.options.ui.attributes.iconHorizontalMargin);

            var graphWidth           = parseInt(isomatic.options.ui.attributes.graphWidth, 10);
            var legendWidth          = parseInt(isomatic.options.ui.attributes.legendWidth, 10);
            var defaultIconSize      = isomatic.options.internal.defaultIconSize;

            var iconsPerRow          = [];
            var iconsPerColumn       = [];
            var iconsPerRowField     = [];


            ////////////////////////////////////
            // Calculations                   //
            ////////////////////////////////////

            for (var i = 0; i < isomatic.data.processed.length; i++) {

                var obj = isomatic.data.processed[i];

                // Calculate Icons per Row
                if (!iconsPerRow[obj.row]) {
                    iconsPerRow[obj.row] = 1;
                } else {
                    iconsPerRow[obj.row] += 1;
                }

                // Calculate Icons per Column
                if (!iconsPerColumn[obj.col]) {
                    iconsPerColumn[obj.col] = 1;
                } else {
                    iconsPerColumn[obj.col] += 1;
                }

                // Calculate Icons per Row Field
                if (!iconsPerRowField[obj.row]) {
                    iconsPerRowField[obj.row] = [];
                }

                if (!iconsPerRowField[obj.row][obj.col]) {
                    iconsPerRowField[obj.row][obj.col] = 1;
                }

                iconsPerRowField[obj.row][obj.col] = Math.max(iconsPerRowField[obj.row][obj.col], obj.relativePos + 1);

            }

            // Calculate Base Scale for Icons depending on biggest Row. (Fit to width)
            var maxIconsPerRow     = d3.max(iconsPerRow);
            var widthLeft          = graphWidth - (maxIconsPerRow * iconHorizontalMargin) - 2 * outerMargin - legendWidth;
            var baseScale          = widthLeft / (maxIconsPerRow * defaultIconSize);
            var calculatedIconSize = Math.round(baseScale * defaultIconSize * 1000) / 1000;

            // Set maximum Icon Size
            if (calculatedIconSize > isomatic.options.internal.maxIconSize) {
                calculatedIconSize = isomatic.options.internal.maxIconSize;
            }

            //////////////////////////////////////////
            // Write calculated Data to Models      //
            //////////////////////////////////////////

            isomatic.data.meta.set({
                iconsPerRow: iconsPerRow,
                iconsPerRowField: iconsPerRowField,
                iconsPerColumn: iconsPerColumn,
                maxIconsPerRow: maxIconsPerRow,
                baseScale: baseScale
            });

            isomatic.options.ui.set({
                calculatedIconSize: calculatedIconSize
            });

            if (isomatic.options.ui.attributes.autoIconSize) {
                isomatic.options.ui.set({
                    iconSize: calculatedIconSize
                });
            }

        },

        /**
         * Calculates the Layout and stores it into isomatic.data.processed
         *
         * Constructs a new isotypeLayout, applies current Options and calculates the Layout
         */
        layout: function() {

            $('#message-box').html('');

            // Set Layouting Options

            this.isotypeLayout = new d3.layout.isotype(); // Sic

            var roundDown = parseFloat(isomatic.options.ui.get("roundDown"));
            var roundUp   = parseFloat(isomatic.options.ui.get("roundUp"));

            // If Round Size is disabled, set both to 0.5 to deactivate this feature
            if (!isomatic.options.ui.attributes.roundSize) {
                roundDown = 0.5;
                roundUp = 0.5;
            }

            this.isotypeLayout
                .roundDown(roundDown)
                .roundUp(roundUp)
                .scale(parseFloat(isomatic.options.ui.get("scale")))
            ;

            isomatic.data.processed = this.isotypeLayout(isomatic.data.raw.get('data'));

        },

        /**
         * Prepares the Drawing
         *
         * Creates and prepares SVG Canvas
         * Creates and prepares the Isotype Layout
         */
        prepareDrawing: function() {

            ////////////////////////////////////
            // Get & Parse Variables          //
            ////////////////////////////////////

            var graphHeight = parseInt(isomatic.options.ui.attributes.graphHeight, 10);
            var graphWidth  = parseInt(isomatic.options.ui.attributes.graphWidth, 10);


            ////////////////////////////////////
            // Prepare Graph Container        //
            ////////////////////////////////////

            // Empty Canvas before Drawing
            $('#graph').html('');

            // Create new SVG Container for D3.js
            this.svg = d3.select("#graph").append("svg")
                .attr("width", graphWidth)
                .attr("height", graphHeight)
                .append("g")
                .attr("id", "isotype")
            ;


        },

        /**
         * Draws Isotype Graphic
         *
         * Here the actual drawing of the Graphic is happening
         * The Visualisation Library D3js is used to create the SVG Elements
         *
         */
        drawIsotype: function() {

            ////////////////////////////////////
            // Get & Parse Variables          //
            ////////////////////////////////////

            var iconHorizontalMargin = parseFloat(isomatic.options.ui.attributes.iconHorizontalMargin);
            var outerMargin          = parseFloat(isomatic.options.ui.attributes.outerMargin);
            var rowMargin            = parseFloat(isomatic.options.ui.attributes.rowMargin);

            var graphHeight          = parseInt(isomatic.options.ui.attributes.graphHeight, 10);
            var graphWidth           = parseInt(isomatic.options.ui.attributes.graphWidth, 10);
            var legendWidth          = parseInt(isomatic.options.ui.attributes.legendWidth, 10);
            var legendTitleHeight    = parseInt(isomatic.options.ui.attributes.legendTitleHeight, 10);
            var iconSize             = parseFloat(isomatic.options.ui.attributes.iconSize);
            var defaultIconSize      = isomatic.options.internal.defaultIconSize;

            var iconize              = isomatic.options.ui.attributes.iconize;
            var colorize             = isomatic.options.ui.attributes.colorize;
            var iconMap              = isomatic.options.ui.attributes.iconMap;
            var colorMap             = isomatic.options.ui.attributes.colorMap;


            ////////////////////////////////////
            // Draw Graphic via D3.js         //
            ////////////////////////////////////

            var g = this.svg.selectAll(".icon")

                .data(isomatic.data.processed)
                .enter()
                    .append("g")
                    .attr("class", "icon")
                    .attr("transform", function(d) {

                        var leftMargin = outerMargin + legendWidth;
                        var topMargin = outerMargin;

                        if (legendTitleHeight > 0) {
                            topMargin += legendTitleHeight + outerMargin;
                        }

                        var x = (d.pos * (iconSize + iconHorizontalMargin)) + leftMargin;
                        var y = d.row * (iconSize + rowMargin) + topMargin;

                        var baseScale = iconSize / defaultIconSize;

                        var scale = baseScale * d.size;

                        // If Icon is drawn smaller than full-size, center it
                        if (d.size < 1) {
                            x += (iconSize / 2) * (1 - d.size);
                            y += (iconSize / 2) * (1 - d.size);
                        }

                        // If Icon is drawn outside of Canvas give a warning
                        if (y > graphHeight || x > graphWidth) {
                            console.warn('<strong>Warning: </strong>The generated Graphic is bigger than its Canvas!');
                        }

                        return 'translate(' + x + ', ' + y + ') scale(' + scale + ')';

                    })
                    .html(function(d) {

                        var iconId, svg;

                        if (iconize === 'row') {
                            iconId = iconMap[d.row].split('-');
                            svg = isomatic.icons[iconId[0]].icons[iconId[1]].svg;
                        } else {
                            iconId = iconMap[d.col].split('-');
                            svg = isomatic.icons[iconId[0]].icons[iconId[1]].svg;
                        }

                        return svg;
                    })
                    .attr("fill", function(d) {
                        if (colorize === 'row') {
                            return '#' + colorMap[d.row];
                        } else {
                            return '#' + colorMap[d.col];
                        }
                    })
            ;

        },

        /**
         * Draw the icons with or without rounding
         */
        drawSizeIsotype: function() {
            console.log('drawSizeIsotype');

            isomatic.options.ui.attributes.roundUp = 1;
            isomatic.options.ui.attributes.roundDown = 0;

            isomatic.options.ui.attributes.scale = 500000000;

            this.layout();
            this.preCalculate();

            this.drawIsotype();
        },

        /**
         * Draws Advanced Isotype Graphic
         *
         * Allows to draw advanced Isotype Layouts with Icons in multiple rows
         */
        drawAdvancedIsotype: function() {

            var self = this;

            ////////////////////////////////////
            // Get & Parse Variables          //
            ////////////////////////////////////

            var iconHorizontalMargin = parseFloat(isomatic.options.ui.attributes.iconHorizontalMargin);
            var iconVerticalMargin   = parseFloat(isomatic.options.ui.attributes.iconVerticalMargin);
            var outerMargin          = parseFloat(isomatic.options.ui.attributes.outerMargin);
            var rowMargin            = parseFloat(isomatic.options.ui.attributes.rowMargin);
            var columnMargin         = parseFloat(isomatic.options.ui.attributes.columnMargin);

            var graphHeight          = parseInt(isomatic.options.ui.attributes.graphHeight, 10);
            var graphWidth           = parseInt(isomatic.options.ui.attributes.graphWidth, 10);
            var legendWidth          = parseInt(isomatic.options.ui.attributes.legendWidth, 10);
            var legendTitleHeight    = parseInt(isomatic.options.ui.attributes.legendTitleHeight, 10);
            var iconSize             = parseFloat(isomatic.options.ui.attributes.iconSize);
            var defaultIconSize      = isomatic.options.internal.defaultIconSize;

            var iconize              = isomatic.options.ui.attributes.iconize;
            var colorize             = isomatic.options.ui.attributes.colorize;
            var iconMap              = isomatic.options.ui.attributes.iconMap;
            var colorMap             = isomatic.options.ui.attributes.colorMap;

            var columns              = isomatic.data.meta.attributes.columns;
            var iconsPerRowField     = isomatic.data.meta.attributes.iconsPerRowField;
            var iconsPerColumn       = isomatic.data.meta.attributes.iconsPerColumn;


            //////////////////////////////////////////
            // PreCalculations                      //
            //////////////////////////////////////////

            var columnPositions      = [];
            var rowPositions         = [];
            var columnWidths         = [];

            rowMargin = Math.max(rowMargin, iconVerticalMargin) - iconVerticalMargin;
            columnMargin = Math.max(columnMargin, iconHorizontalMargin);

            var leftMargin = outerMargin + legendWidth;
            var topMargin = outerMargin;

            if (legendTitleHeight > 0) {
                topMargin += legendTitleHeight + outerMargin;
            }


            //////////////////////////////////////////
            // Calculate Column Positions           //
            //////////////////////////////////////////

            var visualisationWidth = (graphWidth - leftMargin);
            var visualisationWidthSpace = visualisationWidth - (columns.length * columnMargin);

            var currentColumnPosition = leftMargin;

            for (var col = 0; col < columns.length; col++) {

                /** Width of Column Icon Area (excludes margin */
                var currentColumnWidth = 0;

                columnPositions[col] = currentColumnPosition;

                if (isomatic.options.ui.attributes.equallyDistributedColumns) {
                    currentColumnWidth = visualisationWidthSpace / columns.length;
                } else {
                    currentColumnWidth = visualisationWidthSpace * (iconsPerColumn[col] / isomatic.data.processed.length) ;
                }

                columnWidths[col] = Math.floor(currentColumnWidth);
                currentColumnPosition += Math.floor(currentColumnWidth + columnMargin);

            }

            columnPositions.push(currentColumnPosition);


            //////////////////////////////////////////
            // Calculate Row Positions              //
            //////////////////////////////////////////

            var iconWidth = Math.floor(iconSize + iconHorizontalMargin);
            var iconHeight = Math.floor(iconSize + iconVerticalMargin);

            var currentRowPosition = topMargin;

            for (var row = 0; row < iconsPerRowField.length; row++) {

                var rowHeight;

                var maxRows = 1;

                for (var rowColumn = 0; rowColumn < iconsPerRowField[row].length; rowColumn++) {

                    rowPositions[row] = currentRowPosition;

                    var columnTotalWidth = columnWidths[rowColumn];
                    var rowfield = iconsPerRowField[row][rowColumn];
                    var fieldWidth = rowfield * iconWidth;

                    // Add additional margins depending on how many rows it may be right now
                    fieldWidth += Math.ceil(fieldWidth / columnTotalWidth) * (iconHorizontalMargin + columnMargin);

                    if (fieldWidth > columnTotalWidth) {

                        var numberOfRows = Math.ceil(fieldWidth / columnTotalWidth);

                        if (numberOfRows > maxRows) {
                            maxRows = numberOfRows;
                        }

                    }

                }

                rowHeight = (iconHeight * maxRows) + rowMargin;
                currentRowPosition += Math.floor(rowHeight);

                rowPositions.push(currentRowPosition);

            }


            ////////////////////////////////////
            // Draw Graphic via D3.js         //
            ////////////////////////////////////

            var g = this.svg.selectAll(".icon")

                    .data(isomatic.data.processed)
                    .enter()
                    .append("g")
                    .attr("class", "icon")
                    .attr("transform", function(d) {

                        var x, y;

                        var iconWidth = Math.floor(iconSize + iconHorizontalMargin);
                        var iconHeight = Math.floor(iconSize + iconVerticalMargin);

                        var columnPosition = columnPositions[d.col];
                        var rowPosition = rowPositions[d.row];
                        var columnWidth = columnWidths[d.col];

                        // Calculate how many Icons fit into the current Column Width
                        var maxIconsInThisColumn = Math.ceil(columnWidth / iconWidth) - 1;

                        if (d.relativePos < maxIconsInThisColumn) {

                            // Calculate X and Y Coordinates
                            x = Math.floor((d.relativePos * iconWidth) + columnPosition);
                            y = rowPosition;

                        } else {

                            // If Icon is drawn outside of current column width: Break into new line
                            var numberOfRows = Math.floor(d.relativePos / maxIconsInThisColumn);
                            x = ((d.relativePos % maxIconsInThisColumn) * iconWidth) + columnPosition;
                            y = rowPosition + iconHeight * numberOfRows;
                        }


                        var baseScale = iconSize / defaultIconSize;
                        var scale = baseScale * d.size;

                        // If Icon is drawn smaller than full-size, center it
                        if (d.size < 1) {
                            x += Math.floor((iconSize / 2) * (1 - d.size));
                            y += Math.floor((iconSize / 2) * (1 - d.size));
                        }

                        // If Icon is drawn outside of Canvas give a warning
                        if (y > graphHeight || x > graphWidth) {
                            self.drawCanvasOverflowWarning();
                        }

                        if (isomatic.options.ui.attributes.diagramType === 'versus' && d.col === 0) {
                            var center = columnPosition + (columnWidth / 2);
                            var xDiff = center - x;
                            x += 2 * xDiff - iconSize - iconHorizontalMargin + columnMargin;
                            x -= columnMargin;
                        }

                        return 'translate(' + x + ', ' + y + ') scale(' + scale + ')';

                    })
                    .html(function(d) {

                        var iconId, svg;

                        if (iconize === 'row') {
                            iconId = iconMap[d.row].split('-');
                            svg = isomatic.icons[iconId[0]].icons[iconId[1]].svg;
                        } else {
                            iconId = iconMap[d.col].split('-');
                            svg = isomatic.icons[iconId[0]].icons[iconId[1]].svg;
                        }

                        return svg;
                    })
                    .attr("fill", function(d) {
                        if (colorize === 'row') {
                            return '#' + colorMap[d.row];
                        } else {
                            return '#' + colorMap[d.col];
                        }
                    })
                ;


            //////////////////////////////////////////
            // Draw Legend Lines                    //
            //////////////////////////////////////////

            var columnPos, rowPos;

            if (isomatic.options.ui.attributes.drawLines) {

                var verticalLinesArray = [];
                var horizontalLinesArray = [];

                if (isomatic.options.ui.attributes.drawVerticalLines) {

                    // Calculate Vertical Lines
                    for (columnPos = 1; columnPos < columnPositions.length - 1; columnPos++) {
                        for (rowPos = 0; rowPos < rowPositions.length - 1; rowPos++) {
                            verticalLinesArray.push({
                                x1: columnPositions[columnPos],
                                y1: rowPositions[rowPos],
                                x2: columnPositions[columnPos + 1],
                                y2: rowPositions[rowPos + 1]
                            });
                        }
                    }

                    var verticalLines = this.svg.selectAll(".verticalLines")
                        .data(verticalLinesArray)
                        .enter()
                        .append("svg:line")
                        .attr("x1", function(o) {
                            return Math.round(o.x1 - (columnMargin + iconHorizontalMargin) / 2);
                        })
                        .attr("y1", function(o) {
                            return Math.round(o.y1);
                        })
                        .attr("x2", function(o) {
                            return Math.round(o.x1 - (columnMargin + iconHorizontalMargin) / 2);
                        })
                        .attr("y2", function(o) {
                            return Math.round(o.y2);
                        })
                        .style("stroke", '#' + isomatic.options.ui.attributes.lineColor)
                        .style("stroke-width", "1")
                    ;
                }

                if (isomatic.options.ui.attributes.drawHorizontalLines) {

                    // Calculate Horizontal Lines
                    for (columnPos = 0; columnPos < columnPositions.length - 1; columnPos++) {
                        for (rowPos = 1; rowPos < rowPositions.length - 1; rowPos++) {
                            horizontalLinesArray.push({
                                x1: columnPositions[columnPos],
                                y1: rowPositions[rowPos],
                                x2: columnPositions[columnPos + 1],
                                y2: rowPositions[rowPos + 1]
                            });
                        }
                    }

                    var horizontalLines = this.svg.selectAll(".horizontalLines")
                        .data(horizontalLinesArray)
                        .enter()
                        .append("svg:line")
                        .attr("x1", function(o) {
                            return Math.round(o.x1);
                        })
                        .attr("y1", function(o) {
                            return Math.round(o.y1 - (rowMargin + iconVerticalMargin) / 2);
                        })
                        .attr("x2", function(o) {
                            return Math.round(o.x2);
                        })
                        .attr("y2", function(o) {
                            return Math.round(o.y1 - (rowMargin + iconVerticalMargin) / 2);
                        })
                        .style("stroke", '#' + isomatic.options.ui.attributes.lineColor)
                        .style("stroke-width", "1")
                    ;
                }



            }


            if (isomatic.options.internal.debugGrid) {

                var rowLayout = [];

                for (columnPos = 0; columnPos < columnPositions.length - 0; columnPos++) {
                    for (rowPos = 0; rowPos < rowPositions.length - 0; rowPos++) {
                        rowLayout.push({
                            x1: columnPositions[columnPos],
                            y1: rowPositions[rowPos],
                            x2: columnPositions[columnPos + 1],
                            y2: rowPositions[rowPos + 1]
                        });
                    }
                }

                this.svg.selectAll(".verticalLines")
                    .data(rowLayout)
                    .enter()
                    .append("svg:line")
                    .attr("x1", function(o) {
                        return o.x1;
                    })
                    .attr("y1", function(o) {
                        return o.y1;
                    })
                    .attr("x2", function(o) {
                        return o.x1;
                    })
                    .attr("y2", function(o) {
                        return o.y2;
                    })
                    .style("stroke", "rgb(255,120,155)")
                ;

                this.svg.selectAll(".horizontalLines")
                    .data(rowLayout)
                    .enter()
                    .append("svg:line")
                    .attr("x1", function(o) {
                        return o.x1;
                    })
                    .attr("y1", function(o) {
                        return o.y1;
                    })
                    .attr("x2", function(o) {
                        return o.x2;
                    })
                    .attr("y2", function(o) {
                        return o.y1;
                    })
                    .style("stroke", "rgb(5,255,155)")
                ;
            }

            isomatic.data.meta.set({
                columnPositions: columnPositions,
                columnWidths: columnWidths,
                rowPositions: rowPositions
            });

        },

        /**
         * Draws Legend Overlay
         *
         * Draws the Legend, depending on the actual Settings
         * The Visualisation Library D3js is used to create the SVG Text Elements
         */
        drawLegend: function() {

            ////////////////////////////////////
            // Get & Parse Variables          //
            ////////////////////////////////////

            var scale              = parseInt(isomatic.options.ui.attributes.scale, 10);
            var legendWidth        = parseInt(isomatic.options.ui.attributes.legendWidth, 10);
            var rowMargin          = parseFloat(isomatic.options.ui.attributes.rowMargin);
            var outerMargin        = parseFloat(isomatic.options.ui.attributes.outerMargin);
            var graphHeight        = parseInt(isomatic.options.ui.attributes.graphHeight, 10);
            var graphWidth         = parseInt(isomatic.options.ui.attributes.graphWidth, 10);
            var iconSize           = parseFloat(isomatic.options.ui.attributes.iconSize);
            var defaultIconSize    = isomatic.options.internal.defaultIconSize;

            var legendTitleHeight  = parseInt(isomatic.options.ui.attributes.legendTitleHeight, 10);
            var leftLegendFontSize = parseInt(isomatic.options.ui.attributes.leftLegendFontSize, 10);
            var bottomLegendFontSize = parseInt(isomatic.options.ui.attributes.bottomLegendFontSize, 10);

            var iconize            = isomatic.options.ui.attributes.iconize;
            var colorize           = isomatic.options.ui.attributes.colorize;
            var iconMap            = isomatic.options.ui.attributes.iconMap;
            var colorMap           = isomatic.options.ui.attributes.colorMap;

            var legendFont         = isomatic.options.ui.attributes.legendFont;

            var rowPositions                = isomatic.data.meta.attributes.rowPositions;


            ////////////////////////////////////
            // Calculations                   //
            ////////////////////////////////////

            var columnLegendHeight = bottomLegendFontSize * 1.4;

            var scaleText = '1 : ' + this.printScale(scale);

            var leftMargin = outerMargin + legendWidth;
            var topMargin = outerMargin;

            if (legendTitleHeight > 0) {
                topMargin += legendTitleHeight + outerMargin;
            }

            ////////////////////////////////////
            // Legend: Title                  //
            ////////////////////////////////////

            if (legendTitleHeight > 0) {

                var title = this.svg.append("g")
                    .attr("class", "legend-heading")
                    .style("text-anchor", "start")
                    .attr("transform", "translate(" + outerMargin + ", " + (outerMargin + legendTitleHeight/2) + ")")
                ;

                title.append("text")
                    .attr("class", "legend")
                    .text(isomatic.data.meta.attributes.title)
                    .attr("fill", "#000")
                    .attr("font-family", legendFont)
                    .attr("font-size", legendTitleHeight + "px")
                ;
            }


            ////////////////////////////////////
            // Legend: Scale                  //
            ////////////////////////////////////

            var scaleLegend = this.svg.append("g")
                .attr("class", "legend-scale")
                .style("text-anchor", "end")
                .attr("transform", "translate(" + (graphWidth - outerMargin) + ", " + (graphHeight - outerMargin) + ")")
            ;

            scaleLegend.append("text")
                .attr("x", 0)
                .attr("y", -3) // TODO: Hard coded Layout Fix
                .attr("class", "legend")
                .text(scaleText)
                .attr("font-family", legendFont)
                .attr("fill", "#999999")
            ;


            ////////////////////////////////////
            // Legend: Rows                   //
            ////////////////////////////////////

            var rowsLegend = this.svg.append("g")
                .attr("class", "row-legend")
                .attr("width", legendWidth)
                .attr("height", 25)
                .selectAll("g")
                .data(isomatic.data.meta.attributes.rows)
                .enter()
                .append("g")
                .attr("transform", function(d, i) {

                    var y;

                    if (isomatic.options.ui.attributes.diagramType === 'normal' ||
                        isomatic.options.ui.attributes.diagramType === 'size') {
                        y = i * (iconSize + rowMargin) + outerMargin;
                        if (legendTitleHeight > 0) {
                            y += legendTitleHeight + outerMargin;
                        }
                    } else if (isomatic.options.ui.attributes.diagramType === 'compare' ||
                        isomatic.options.ui.attributes.diagramType === 'versus') {
                        y = rowPositions[i];
                    }

                    return "translate(0," + y + ")";
                })
            ;

            rowsLegend.append("text")
                .attr("x", outerMargin)
                .attr("y", iconSize / 2)
                .attr("dy", ".35em")
                .attr("font-size", leftLegendFontSize)
                .attr("font-family", legendFont)
                .text(function(d) { return d; })
            ;


            ////////////////////////////////////
            // Legend: Columns                //
            ////////////////////////////////////

            if (!isomatic.options.ui.attributes.drawColumnLegend) {

                // Don't draw any Column Legend
//                console.log('Not drawing Column Legend');


            } else if (colorize !== 'column' && iconize !== 'column') {

                // No Column Mapping!
                // User did not assign the Column to either Color or Icon
                // => Can't generate a Column Legend without Mapping

                var noColumnLegend = this.svg.append("g")
                    .attr("class", "no-column-legend")
                    .style("text-anchor", "start")
                    .attr("transform", "translate(" + outerMargin + ", " + (graphHeight - outerMargin) + ")")
                ;

                noColumnLegend.append("text")
                    .attr("x", 0)
                    .attr("y", -3) // TODO: Hard coded Layout Fix
                    .attr("class", "legend")
                    .text("Warning: Columns are not mapped")
                    .attr("font-family", legendFont)
                    .attr("fill", "#999999")
                ;

            } else {

                // Column Mapping available

                var columnsLegend = this.svg.append("g")
                    .attr("class", "column-legend")
                    .attr("width", legendWidth)
                    .attr("height", columnLegendHeight)
                    .selectAll("g")
                    .data(isomatic.data.meta.attributes.columns)
                    .enter()
                    .append("g")
                    .attr("transform", function(d, i) {
                        var x = i * (legendWidth + columnLegendHeight) + outerMargin ;
                        var y = (graphHeight - outerMargin - columnLegendHeight);
                        return "translate(" + x + "," + y + ")";
                    })
                ;

                if (colorize === 'column' && iconize === 'row') {
                    columnsLegend.append("rect")
                        .attr("class", "column-legend-color")
                        .attr("width", columnLegendHeight)
                        .attr("height", columnLegendHeight)
                        .style("fill", function(d, i) { return '#' + colorMap[i]; })
                    ;
                }

                if (iconize === 'column') {

                    columnsLegend.append("g")
                        .attr("class", "column-legend-icon")
                        .attr("width", columnLegendHeight)
                        .attr("height", columnLegendHeight)
                        .attr("transform", function(d) {

                            var scale = columnLegendHeight / defaultIconSize;

                            return 'scale(' + scale + ')';

                        })
                        .html(function(d, i) {

                            var iconId = iconMap[i].split('-');
                            return isomatic.icons[iconId[0]].icons[iconId[1]].svg;
                        })
                        .style("fill", function(d, i) {

                            if (colorize === 'column') {
                                return '#' + colorMap[i];
                            } else {
                                return '#000000';
                            }
                        })
                    ;
                }

                columnsLegend.append("text")
                    .attr("x", columnLegendHeight + 5)
                    .attr("y", columnLegendHeight / 2)
                    .attr("dy", ".35em")
                    .attr("font-size", bottomLegendFontSize)
                    .attr("font-family", legendFont)
                    .attr("fill", "#999999")
                    .text(function(d) { return d; })
                ;
            }

        },


        ///////////////////////////////////
        // Helper Functions              //
        ///////////////////////////////////

        /**
         * Draws an Canvas Overflow Warning if the GraphView draws something outside of the current Canvas
         */
        drawCanvasOverflowWarning: function() {

            if ($('#overflow-warning').length === 0) {

                $('#message-box')
                    .append('<div id="overflow-warning"><strong>Warning</strong>: The graphic is bigger than the canvas!</div>')
                ;
            }
        },

        /**
         * Pretty prints the Scale (for use with the Legend and the UI)
         *
         * http://stackoverflow.com/a/2901298/776425
         *
         * @param   {Number}   scale     Scale to "prettify"
         * @returns {String}
         */
        printScale: function(scale) {
            return scale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    });

}(isomatic));

