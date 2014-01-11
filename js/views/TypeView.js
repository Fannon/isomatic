/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

/**
 * Type View
 *
 * @type {*|void|Object}
 */
isomatic.views.TypeView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        this.render();
    },
    render: function(){
        "use strict";

        var source = $('#type-template').html();
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
