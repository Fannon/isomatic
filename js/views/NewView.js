/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Import View
     *
     * @type {*|void|Object}
     */
    isomatic.views.NewView = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){
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

}(isomatic));

