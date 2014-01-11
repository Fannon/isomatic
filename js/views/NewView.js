/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

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

        var source = $('#new-template').html();
        var template = Handlebars.compile(source);
        var html = template();
        this.$el.html(html);

    },
    events: {
        "click #generate-new-graphic": "generateNewGraphic"
    },

    generateNewGraphic: function() {
        // TODO
    }
});
