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

        // Calculate current Colormap
        var colorMap = {};
        for (var i = 0; i < isomatic.data.meta.rows.length; i++) {
            colorMap[isomatic.data.meta.rows[i]] = isomatic.options.ui.attributes.colorMap[i];
        }

        var html = template({
            colorMap: colorMap,
            palettes: isomatic.options.internal.colorPalettes
        });

        this.$el.html(html);

        // Init ColorPicker
        $('.picker').each(function() {
            isomatic.registerColorpicker($(this));
        });

    },
    events: {
        "click #color": "colorClick"
    }
});
