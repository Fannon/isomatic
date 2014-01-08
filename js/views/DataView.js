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
        "click #pasteDataSubmit": "submitData",
        "click #pasteDataSubmitClose": "submitDataClose"
    },

    /**
     * Reads the pasted TSV (Tab Seperated Values) from the textare and convertes it to Array Structure
     * Generates Preview via HandsonTable
     */
    submitData: function() {
        "use strict";
        console.log('DataView::submitData();');

        var data = d3.tsv.parse($('#dataPaste')[0].value);
        console.dir(data);

        // Convert Data to 2dim Array for previewing with HandsoneTable:
        var handsonTableArray = [[]];

        for (var o in data[0]) {
            handsonTableArray[0].push(o);
        }

        for (var i = 0; i < data.length; i++) {
            handsonTableArray[i+1] = [];
            for (var obj_inner in data[1]) {
                handsonTableArray[i+1].push(data[i][obj_inner]);
            }
        }

        console.dir(handsonTableArray);


        $("#dataTable").handsontable({
            data: handsonTableArray,
            contextMenu: true
        });

        // TODO: Validation

        // TODO: Redraw
        isomatic.data.process(data);

    },

    submitDataClose: function () {
        "use strict";
        this.submitData();

        // TODO: Refactor this
        $('#overlay-data').hide();

    }
});
