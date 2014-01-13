/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

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
        "use strict";

        this.render();
        this.submitData();
    },

    /**
     * Render Data View
     */
    render: function() {
        "use strict";

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
        "use strict";

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
        "use strict";

        console.log('DataView::submitData();');

        var data = d3.tsv.parse($('#pasted-data').val());

        // Generate Preview Table from data
        this.tabulate(data);

        // TODO: Validation

        // Process and draw Data
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
            if (data[0].hasOwnProperty(o)) {
                columns.push(o);
            }
        }

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) {
                return column;
            });

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
            .text(function(d) {
                return d.value;
            });

        return table;
    }

});
