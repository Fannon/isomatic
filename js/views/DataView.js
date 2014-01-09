/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _ */

/**
 * Data View
 *
 * @type {*|void|Object}
 */
isomatic.views.DataView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        console.log('DataView init');

        this.render();

        this.submitData();

        /**
         * Select All on Hover
         * http://stackoverflow.com/a/5797700/776425
         */
        $("#dataPaste").focus(function() {
            var $this = $(this);
            $this.select();

            // Work around Chrome's little problem
            $this.mouseup(function() {
                // Prevent further mouseup intervention
                $this.unbind("mouseup");
                return false;
            });
        });


    },
    render: function(){
        "use strict";

        //Pass variables in using Underscore.js Template
        var variables = {
            preset_data: isomatic.options.internal.exampleData
        };

        // Compile the template using underscore
        var template = _.template( $("#data_template").html(), variables );

        // Load the compiled HTML into the Backbone "el"
        this.$el.html( template );
    },
    events: {
        "click #pasteDataSubmit": "submitData",
        "click #pasteDataSubmitClose": "submitDataClose",
        "click #pasteDataUpdate": "updateData"
    },

    /**
     * Reads the pasted TSV (Tab Seperated Values) from the textare and convertes it to Array Structure
     * Generates Preview via HandsonTable
     */
    submitData: function() {
        "use strict";

        console.log('DataView::submitData();');

        var data = d3.tsv.parse($('#dataPaste')[0].value);

//        var handsonTableArray = this.convertDataToHandsoneTableData(data);

//        $("#dataTable").handsontable({
//            data: handsonTableArray,
//            contextMenu: true,
//            rowHeaders: true,
//            colHeaders: true,
//            minRows: 1,
//            stretchH: 'all'
//        });

        this.tabulate(data);

        // TODO: Validation

        // TODO: Redraw
        isomatic.data.process(data);

    },

    submitDataClose: function () {
        "use strict";
        this.submitData();

        // TODO: Refactor this
        $('#overlay-data').hide();

    },

    updateData: function() {
        "use strict";
        // TODO: Get new Data from edited HansoneTable
        var data =
        isomatic.data.process(data);
    },

    /**
     * Generate Preview Table via D3.js
     *
     * @param data  Data Array
     */
    tabulate: function(data) {
        "use strict";

        var table = d3.select("#dataTable");

        $("#dataTable").html("");

        var thead = table.append("thead");
        var tbody = table.append("tbody");

        // Get Columns from Data
        var columns = [];
        for (var o in data[0]) {
            if( data[0].hasOwnProperty(o) ) {
                columns.push(o);
            }
        }

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .text(function(d) { return d.value; });

        return table;
    },


    // Helper Functions
    convertDataToHandsoneTableData: function(data) {
        "use strict";

        // Convert Data to 2dim Array for previewing with HandsoneTable:
        var handsonTableArray = [[]];

        for (var o in data[0]) {
            if( data[0].hasOwnProperty(o) ) {
                handsonTableArray[0].push(o);
            }
        }

        for (var i = 0; i < data.length; i++) {
            handsonTableArray[i+1] = [];
            for (var obj_inner in data[1]) {
                if( data[1].hasOwnProperty(obj_inner) ) {
                    handsonTableArray[i+1].push(data[i][obj_inner]);
                }
            }
        }

        return handsonTableArray;
    }
});
