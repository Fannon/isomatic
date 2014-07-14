/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Text View
     *
     * @type {*|void|Object}
     */
    isomatic.views.TextView = Backbone.View.extend( /** @lends TextView.prototype */ {

        /**
         * @class TextView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){
            this.render();

            // Register Model Event Listeners
            this.model.on("change:legendWidth", this.render, this);
            this.model.on("change:legendTitleHeight", this.render, this);
            this.model.on("change:drawColumnLegend", this.render, this);

        },

        /**
         * Render Text View
         */
        render: function(){

            var source = $('#text-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                availableFonts: isomatic.options.internal.availableFonts,
                options: isomatic.options.ui.attributes
            });
            this.$el.html(html);

            Backbone.Validation.bind(this);

            // Init Scrollbar
            try {
                var slimScrollOptions = isomatic.options.internal.slimScrollOptions;
                slimScrollOptions.height = isomatic.options.ui.attributes.graphHeight - 80;
                $('#text-container .scrollbar').slimScroll(slimScrollOptions);
            } catch (e) {
                console.error('Error loading Scrollbar Plugin!');
            }
        },

        /**
         * Options.ui Model
         */
        model: isomatic.options.ui,

        events: {
            "click #text-apply": "apply",
            "click #text-apply-close": "apply",
            "keydown input": "keyDown"
        },

        keyDown: function(e) {
            if (e.which === 13) {
                e.preventDefault();
                this.apply();
            }
        },


        /**
         * Apply Adjustments to Graphic
         */
        apply: function() {

            var state = {
                'legendWidth': $('#legend-width').val(),
                'legendTitleHeight': $('#legend-title-height').val(),
                'leftLegendFontSize': $('#left-legend-fontsize').val(),
                'bottomLegendFontSize': $('#bottom-legend-fontsize').val(),
                'legendFont': $('#legend-font').val(),
                'drawColumnLegend': $('#draw-column-legend').prop('checked')
            };

            var isValid = this.model.set(state, {validate: true});

            if (isValid) {
                isomatic.refreshLayout();
            }

        }
    });

}(isomatic));

