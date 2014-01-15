/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Scale View
     *
     * @type {*|void|Object}
     */
    isomatic.views.ScaleView = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){

            var source = $('#scale-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                options: isomatic.options.ui.attributes
            });
            this.$el.html(html);

        },
        events: {
            "click #color": "colorClick"
        }
    });

}(isomatic));

