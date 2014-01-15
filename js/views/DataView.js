/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Data View
     *
     * @type {*|void|Object}
     */
    isomatic.views.DataView = Backbone.View.extend({

        /**
         * Init Data View
         */
        initialize: function() {

            this.render();

            // TODO: Geht sicher eleganter
            this.submitData();
        },

        /**
         * Render Data View
         */
        render: function() {

            var source = $('#data-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                preset_data: isomatic.options.internal.exampleData
            });
            this.$el.html(html);

        },

        /**
         * Data view Events
         */
        events: {
            "click #import-data": "submitData",
            "click #import-data-close": "submitData",
            "focus #pasted-data": "focusTextarea"
        },

        /**
         * Little Helper Function to Select all Text in Import-Textarea
         * http://stackoverflow.com/a/5797700/776425
         */
        focusTextarea: function() {

            var $textarea = $('#pasted-data');
            $textarea.select();

            // Work around Chrome's little problem
            $textarea.mouseup(function() {
                // Prevent further mouseup intervention
                $textarea.unbind("mouseup");
                return false;
            });
        },

        /**
         * Reads the pasted TSV (Tab Seperated Values) from the textare and convertes it to Array Structure
         * Generates Preview via HandsonTable
         */
        submitData: function() {

            console.log('DataView::submitData();');

            var data = d3.tsv.parse($('#pasted-data').val());

            // Generate Preview Table from data
            this.tablePreview(data);

            // TODO: Validation

            // Process and draw Data
            this.process(data);

        },

        /**
         * Generate Preview Table via D3.js
         *
         * @param data  Data Array
         */
        tablePreview: function(data) {

            var table = d3.select("#dataTable");

            $("#dataTable").html("");

            var thead = table.append("thead");
            var tbody = table.append("tbody");

            // Get Columns from Data
            var columns = [];
            for (var o in data[0]) {
                if (data[0].hasOwnProperty(o)) {
                    columns.push(o);
                }
            }

            // Create Header Row (TH)
            thead.append("tr")
                .selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .text(function(column) {
                    return column;
                });

            // Create Rows
            var rows = tbody.selectAll("tr")
                .data(data)
                .enter()
                .append("tr");

            // Populate Rows with Cells
            var cells = rows.selectAll("td")
                .data(function(row) {
                    return columns.map(function(column) {
                        return {column: column, value: row[column]};
                    });
                })
                .enter()
                .append("td")
                .text(function(d) {
                    return d.value;
                });

            return table;
        },

        /**
         * Process the Data
         *
         * @param data
         */
        process: function(data) {

            console.log('DataView.process(data);');
            console.dir(data);

            isomatic.data.raw = data;

            // Analyze Data
            this.analyze(data);

            // Prepare Drawing
            isomatic.views.graphView.prepareDrawing();

            // Generate Layout
            isomatic.data.processed = isomatic.views.graphView.isotypeLayout(data);

            // Precalculate Layout and save it into the Metadata Object.
            isomatic.views.graphView.precalculate();

            // Draw Isotype Graphic
            isomatic.views.graphView.drawIsotype();

            // Draw Legend Overlay
            isomatic.views.graphView.drawLegend();
        },

        /**
         * Calculates the Scale from the Raw Data
         * Returns nice Scales like 1:10000
         *
         * @param {Array} data Raw Data Array
         */
        analyze: function(data) {

            console.log('DataView.analyze(data);');

            var values = [];
            var rowValues = [];
            var availableScales = [];


            // Reset previous Calculations:
            isomatic.data.meta.attributes.rows = [];
            isomatic.data.meta.attributes.columns = [];


            ///////////////////////////////////////
            // Analyse Values, Rows and Columns  //
            ///////////////////////////////////////

            // Iterate over Rows
            for (var rowCounter = 0; rowCounter < data.length; rowCounter++) {

                var columnCounter = 0;
                var currentRow = data[rowCounter];
                var rowValue = 0;

                // Iterate over Columns
                for (var obj in currentRow) {
                    if(currentRow.hasOwnProperty(obj)){

                        // Put all available Columns into an array
                        if (rowCounter === 0  && columnCounter >= 1) {
                            isomatic.data.meta.attributes.rows.push(obj);
                        }

                        if (columnCounter === 0) {
                            // Put first Column (Description) into a Column Array
                            isomatic.data.meta.attributes.columns.push(currentRow[obj]);
                        } else {
                            values.push(parseInt(currentRow[obj], 10));
                            rowValue += parseInt(currentRow[obj], 10);
                        }

                        columnCounter += 1;
                    }
                }

                rowValues[rowCounter] = rowValue;
            }

            isomatic.data.meta.set('min', d3.min(values));
            isomatic.data.meta.set('max', d3.max(values));
            isomatic.data.meta.set('sum', d3.sum(values));

            isomatic.data.meta.set('rowValues', rowValues);
            isomatic.data.meta.set('maxRowValues', d3.max(rowValues));


            ///////////////////////////////////////
            // Calculate a recommended Scale     //
            ///////////////////////////////////////

            var scaleTemp = isomatic.data.meta.attributes.sum / isomatic.options.internal.desiredTotalIcons;
            //    var scaleTemp = isomatic.data.meta.attributes.maxRowValues / isomatic.options.internal.desiredmaxIconsPerRow;

            var scaleArray = isomatic.options.internal.scaleArray;

            // Get fitting Scales from the Array
            // TODO: Check for Array Boundaries!
            for (var j = 0; j < scaleArray.length; j++) {
                if (scaleTemp <= scaleArray[j]) {
                    if (scaleArray[j] - scaleTemp < scaleTemp - scaleArray[j - 1]) {
                        availableScales = [
                            scaleArray[j - 1],
                            scaleArray[j],
                            scaleArray[j + 1]
                        ];
                    } else {
                        availableScales = [
                            scaleArray[j - 2],
                            scaleArray[j - 1],
                            scaleArray[j]
                        ];
                    }
                    break;
                }
            }

            console.log('-> Calculated Scale: ' + availableScales[1] + ' from ' + scaleTemp);

            isomatic.options.ui.set("scale", availableScales[1]);
            isomatic.options.ui.set("availableScales", availableScales);

        }

    });


}(isomatic));

