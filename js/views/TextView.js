/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Text View
     *
     * @type {*|void|Object}
     */
    isomatic.views.TextView = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){

            var source = $('#text-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                palettes: isomatic.options.internal.colorPalettes
            });
            this.$el.html(html);

        },
        events: {
            "click #color": "colorClick"
        }
    });

}(isomatic));

