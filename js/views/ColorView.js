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
        var i = 0;
        if (isomatic.options.ui.attributes.colorize === 'row') {
            for (i = 0; i < isomatic.data.meta.columns.length; i++) {
                if (isomatic.data.meta.columns[i] !== '') {
                    colorMap[isomatic.data.meta.columns[i]] = isomatic.options.ui.attributes.colorMap[i];
                }  else {
                    colorMap['Row ' + (i + 1)] = isomatic.options.ui.attributes.colorMap[i];
                }
            }
        } else {
            for (i = 0; i < isomatic.data.meta.rows.length; i++) {
                if (isomatic.data.meta.rows[i].trim() !== '') {
                    colorMap[isomatic.data.meta.rows[i]] = isomatic.options.ui.attributes.colorMap[i];
                }  else {
                    colorMap['Column ' + (i + 1)] = isomatic.options.ui.attributes.colorMap[i];
                }
            }
        }

        var html = template({
            options: isomatic.options.ui.attributes,
            colorMap: colorMap,
            palettes: isomatic.options.internal.colorPalettes
        });

        this.$el.html(html);

        // Check Column / Row
        if (isomatic.options.ui.attributes.colorize === 'row') {
            $('#colorize-row').attr("checked","checked");
            $('#colorize-column').removeAttr("checked");
        } else {
            $('#colorize-column').attr("checked","checked");
            $('#colorize-row').removeAttr("checked");
        }

        // Init ColorPicker
        $('.picker').each(function() {
            isomatic.registerColorpicker($(this));
        });

    },
    events: {
        "click #colorize-column": "colorizeColumn",
        "click #colorize-row": "colorizeRow"
    },
    colorizeColumn: function() {
        "use strict";
        isomatic.options.ui.set('colorize', 'column');
        this.render();
        $('#overlay-color').show();
    },
    colorizeRow: function() {
        "use strict";
        isomatic.options.ui.set('colorize', 'row');
        this.render();
        $('#overlay-color').show();
    }
});
