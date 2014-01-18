/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Data View
     *
     * @type {*|void|Object}
     */
    isomatic.views.DataView = Backbone.View.extend( /** @lends DataView.prototype */ {

        /**
         * @class DataView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function() {

            this.render();

            // Register Model Event Listeners
            this.model.on("change", this.tablePreview, this);

            // Preview Table for Example Data
            this.tablePreview();

        },

        /**
         * Render Data View
         */
        render: function() {

            console.info('DataView.render();');

            var source = $('#data-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                preset_data: isomatic.options.internal.exampleData
            });
            this.$el.html(html);

            // Init Scrollbar
            $('.scrollbar').slimScroll({
                'height': isomatic.options.ui.attributes.graphHeight
            });

        },

        model: isomatic.data.raw,

        /**
         * DataView Events
         */
        events: {
            "focus #pasted-data": "focusTextarea",
            "click #import-data": "submitData",
            "click #import-data-close": "submitData"
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

            var pastedData = $('#pasted-data').val();

            // TODO: Validation:
            if (!pastedData || pastedData === '') {
                console.warn('Validation not passed');
            } else {

                var parsedData = d3.tsv.parse(pastedData);
                this.model.set({
                    data: parsedData
                });

                // Generate Preview Table from data
                this.tablePreview(this.model.get('data'));

                // Process and draw Data
                isomatic.refreshData();
            }

        },

        /**
         * Generate Preview Table via D3.js
         * Adapted from: http://stackoverflow.com/a/18072266
         */
        tablePreview: function() {

            var data = this.model.get('data');
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
         * Calculates the Scale from the Raw Data
         * Returns nice Scales like 1:10000
         */
        analyze: function() {

            console.log('DataView.analyze(data);');

            var values = [];
            var rowValues = [];
            var availableScales = [];
            var rows = [];
            var columns = [];
            var title = '';

            var data = this.model.get('data');


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
                        if (rowCounter === 0) {
                            if (columnCounter === 0) {
                                // Set Title
                                title = obj;
                            } else {
                                columns.push(obj);
                            }
                        }

                        if (columnCounter === 0) {
                            // Put first Column (Description) into a Column Array
                            rows.push(currentRow[obj]);
                        } else {
                            values.push(parseInt(currentRow[obj], 10));
                            rowValue += parseInt(currentRow[obj], 10);
                        }

                        columnCounter += 1;
                    }
                }

                rowValues[rowCounter] = rowValue;
            }

            isomatic.data.meta.set({
                min: d3.min(values),
                max: d3.max(values),
                sum: d3.sum(values),
                title: title,
                rows: rows,
                columns: columns,
                rowValues: rowValues,
                maxRowValues: d3.max(rowValues)
            });

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

            isomatic.options.ui.set({
                scale: availableScales[1],
                availableScales: availableScales
            });

        }

    });

}(isomatic));

