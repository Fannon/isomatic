/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _ */

/**
 * Import View
 *
 * @type {*|void|Object}
 */
isomatic.views.NewView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        console.log('NewView init');
        this.render();
    },
    render: function(){
        "use strict";

        //Pass variables in using Underscore.js Template
        var variables = {
            preset_data: isomatic.options.internal.exampleData
        };

        // Compile the template using underscore
        var template = _.template( $("#new_template").html(), variables );

        // Load the compiled HTML into the Backbone "el"
        this.$el.html(template);
    },
    events: {
        "click #pasteDataSubmit": "submitData"
    }
});
