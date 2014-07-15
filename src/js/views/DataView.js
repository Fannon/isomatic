/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";


    isomatic.views.DataView = Backbone.View.extend( /** @lends DataView.prototype */ {

        /**
         * The Data View handles the Import of Data via Copy'n'Paste
         * It also analyzes the data to generate useful metadata informations from it
         * Generates a simple Table Preview of the current Data via D3.js
         *
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

//            console.info('DataView.render();');

            var source = $('#data-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                preset_data: isomatic.options.internal.exampleData
            });
            this.$el.html(html);

            // Init Scrollbar
            try {
                var slimScrollOptions = isomatic.options.internal.slimScrollOptions;
                slimScrollOptions.height = isomatic.options.ui.attributes.graphHeight - 34;
                $('#data-container .scrollbar').slimScroll(slimScrollOptions);
            } catch (e) {
                console.error('Error loading Scrollbar Plugin!');
            }

        },

        model: isomatic.data.raw,

        /**
         * DataView Events
         */
        events: {
            "focus #pasted-data": "focusTextarea",
            "click #import-data": "submitData",
            "click #import-data-close": "submitData",
            "keydown input": "keyDown"
        },

        /**
         * Register the enter key in input fields
         * @param e
         */
        keyDown: function(e) {
            if (e.which === 13) {
                e.preventDefault();
                this.apply();
            }
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

//            console.log('DataView::submitData();');

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

                // Set Scale to 0 to re-trigger the calculation of it
                isomatic.options.ui.attributes.scale = 0;

                // Process and draw Data
                isomatic.refreshData();
            }

        },

        /**
         * Generate Preview Table via D3.js
         *
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
         * Analyzes the Data and saves the calculations to the metadata object
         *
         * Calculates a recommended Scale from the Raw Data
         * Calculates MetaData about the RawData
         * Fills up the ColorMap and IconMap Array if they are not sufficient
         */
        analyze: function() {

//            console.log('DataView.analyze(data);');

            var values          = [];
            var rowValues       = [];
            var rows            = [];
            var columns         = [];
            var title           = '';

            var data            = this.model.get('data');

            var scale           = parseInt(isomatic.options.ui.attributes.scale, 10);

            var iconMap         = isomatic.options.ui.attributes.iconMap;
            var colorMap        = isomatic.options.ui.attributes.colorMap;


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


            ///////////////////////////////////////
            // Fill up Icon and Color Mapping    //
            ///////////////////////////////////////

            // Check if ColorMap and IconMap are big enough for current Dataset.
            // If not, fill them up with default Values

            // Used for Calculations
            var diff, i, j;
            var maxSize     = Math.max(columns.length, rows.length);

            // Adjust ColorMap
            diff = maxSize - colorMap.length;
            if (diff > 0) {
                console.info('ColorMap misses ' + diff + 'Colors. They will be filled up with defaults.');
                for (i = 0; i <= diff; i++) {
                    colorMap.push(isomatic.options.internal.defaultColor);
                }
            }

            // Adjust IconMap
            diff = maxSize - iconMap.length;
            if (diff > 0) {
                console.info('IconMap misses ' + diff + 'Icons. They will be filled up with defaults.');
                for (j = 0; j <= diff; j++) {
                    iconMap.push(isomatic.options.internal.defaultIcon);
                }
            }


            ///////////////////////////////////////
            // Update Metadata Model             //
            ///////////////////////////////////////

            isomatic.data.meta.set({
                min: d3.min(values),
                max: d3.max(values),
                sum: d3.sum(values),
                title: title,
                rows: rows,
                columns: columns,
                rowValues: rowValues,
                maxRowValues: d3.max(rowValues),
                iconMap: iconMap,
                colorMap: colorMap
            });


            ///////////////////////////////////////
            // Calculate a recommended Scale     //
            ///////////////////////////////////////

            // Calculate the Scale only if its not already set or imported
            if (scale === 0) {
                this.calculateRecommendedScale();
            }

        },

        /**
         * Calculates a recommended Scale
         *
         * Helper Function, used by the analyze function
         * Currently based on an desired Icon per Row Setting
         * Chooses the nearest scale from the isomatic.options.internal.scalesArray
         */
        calculateRecommendedScale: function() {

            var scale      = 0;
            var scaleArray = isomatic.options.internal.scaleArray;
            var scaleTemp  = isomatic.data.meta.attributes.maxRowValues / isomatic.options.internal.desiredmaxIconsPerRow;

            // Get nearest fitting Scale from the ScalesArray
            for (var j = 0; j < scaleArray.length; j++) {
                if (scaleTemp <= scaleArray[j]) {
                    if (scaleArray[j] - scaleTemp < scaleTemp - scaleArray[j - 1]) {
                        scale = scaleArray[j];
                    } else {
                        scale = scaleArray[j - 1];
                    }
                    break;
                }
            }

//            console.log('-> Calculated Scale: ' + scale + ' from ' + scaleTemp);

            ///////////////////////////////////////
            // Update Option Model               //
            ///////////////////////////////////////

            isomatic.options.ui.set({
                scale: scale
            });
        }




        });

}(isomatic));

