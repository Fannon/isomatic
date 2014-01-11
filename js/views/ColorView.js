/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

/**
 * Color View
 *
 * @type {*|void|Object}
 */
isomatic.views.ColorView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        this.render();
        $('#colorpalette-Dracula').addClass('active');

    },
    render: function(){
        "use strict";

        var source = $('#color-template').html();
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
