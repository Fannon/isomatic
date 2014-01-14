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

        // Init Scrollbar Plugin


    },
    render: function(){
        "use strict";

        var source = $('#color-template').html();
        var template = Handlebars.compile(source);

        // Calculate current Colormap
        var colorMap = {};
        var i = 0;
        if (isomatic.options.ui.attributes.colorize === 'row') {
            for (i = 0; i < isomatic.data.meta.attributes.columns.length; i++) {
                colorMap[isomatic.data.meta.attributes.columns[i]] = isomatic.options.ui.attributes.colorMap[i];
            }
        } else {
            for (i = 0; i < isomatic.data.meta.attributes.rows.length; i++) {
                colorMap[isomatic.data.meta.attributes.rows[i]] = isomatic.options.ui.attributes.colorMap[i];
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

        // Init Scrollbar
        $('.scrollbar').slimScroll(isomatic.options.internal.slimmScrollOptions);

    },
    events: {
        "click #colorize-column": "colorizeColumn",
        "click #colorize-row": "colorizeRow",
        "click .colorpalette": "selectColorpalette",
        "click #color-apply": "applyColor",
        "click #color-apply-close": "applyColor"
    },
    colorizeColumn: function() {
        "use strict";
        isomatic.options.ui.set('colorize', 'column');
        this.render();
    },
    colorizeRow: function() {
        "use strict";
        isomatic.options.ui.set('colorize', 'row');
        this.render();
    },
    applyColor: function() {
        "use strict";
        isomatic.views.dataView.submitData();
    },
    /**
     * Selects the Colorpalette and applies it to the Colorpickers and the Graphic
     * @param event
     */
    selectColorpalette: function(event) {
        "use strict";

        var selectedColorPalette = event.currentTarget.id.split('-')[1];
        isomatic.options.ui.set('colorMap', isomatic.options.internal.colorPalettes[selectedColorPalette]);

        this.render();
        $('#' + event.currentTarget.id).addClass('active');
        $('#overlay-color').show();
    }
});
