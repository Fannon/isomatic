/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _ */

// TODO: Not working
isomatic.views.DataView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        console.log('DataView init');

        this.render();
    },
    render: function(){
        "use strict";

        //Pass variables in using Underscore.js Template
        var variables = {
            search_label: "My Search"
        };

        // Compile the template using underscore
        var template = _.template( $("#data_template").html(), variables );

        // Load the compiled HTML into the Backbone "el"
        this.$el.html( template );
    },
    events: {
        "click #pasteDataSubmit": "submitData"
    },

    /**
     * Reads the pasted TSV (Tab Seperated Values) from the textare and convertes it to Array Structure
     * Generates Preview via HandsonTable
     */
    submitData: function() {
        "use strict";
        console.log('DataView::submitData();');

        var tsv = $.tsv.parseRows($('#dataPaste')[0].value);
        console.dir(tsv);

        $("#dataTable").handsontable({
            data: tsv
        });

        // TODO: Validation

        // TODO: Converting to D3JS Object

        // TODO:
    }
});
