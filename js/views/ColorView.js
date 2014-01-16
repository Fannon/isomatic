/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Color View
     *
     * @type {*|void|Object}
     */
    isomatic.views.ColorView = Backbone.View.extend({

        /**
         * Init Color View
         */
        initialize: function(){

            this.render();

            // Register Model Event Listeners
            this.model.on("change:colorMap", this.render, this);
            this.model.on("change:colorize", this.render, this);
            isomatic.data.meta.on("change:rows", this.render, this);
            isomatic.data.meta.on("change:columns", this.render, this);

        },

        /**
         * Render Color View
         * Calculates Data Structures for View
         */
        render: function(){

            console.info('ColorView Rendering');

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
            $('.scrollbar').slimScroll({
                'height': isomatic.options.ui.attributes.graphHeight
            });

        },

        model: isomatic.options.ui,

        /**
         * Color View Events
         */
        events: {
            "click #colorize-column":   "colorizeColumn",
            "click #colorize-row":      "colorizeRow",
            "click .colorpalette":      "selectColorpalette",
            "click #color-apply":       "apply",
            "click #color-apply-close": "apply"
        },

        /**
         * Applies current Colors from Colorpicker to Model and updates the Graphic View
         */
        apply: function() {

            // Read current values from ColorPicker and apply them to the ColorMap
            var colors = [];
            $('.picker').each(function (index, element) {
                colors.push(element.value);
            });

            this.model.set({
                colorMap: colors
            });

            isomatic.refreshDesign();
        },

        /**
         * Set Colorize Mode to Column
         */
        colorizeColumn: function() {

            this.model.set({
                colorize: 'column'
            });
        },

        /**
         * Set Colorize Mode to Row
         */
        colorizeRow: function() {

            this.model.set({
                colorize: 'row'
            });
        },

        /**
         * Selects the Colorpalette and applies it to the Colorpickers and the Graphic
         * @param event
         */
        selectColorpalette: function(event) {

            var selectedColorPalette = event.currentTarget.id.split('-')[1];
            this.model.set({
                colorMap: isomatic.options.internal.colorPalettes[selectedColorPalette]
            });

            $('#' + event.currentTarget.id).addClass('active');
            $('#overlay-color').show();
        }

    });
}(isomatic));
