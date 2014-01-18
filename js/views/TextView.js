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
                options: isomatic.options.ui.attributes
            });
            this.$el.html(html);

            Backbone.Validation.bind(this);

        },

        /**
         * Options.ui Model
         */
        model: isomatic.options.ui,

        events: {
            "click #text-apply": "apply",
            "click #text-apply-close": "apply"
        },


        /**
         * Apply Adjustments to Graphic
         */
        apply: function() {

            var state = {
                'legendWidth': $('#legend-width').val(),
                'legendTitleHeight': $('#legend-title-height').val(),
                'drawColumnLegend': $('#draw-column-legend').prop('checked')
            };

            var isValid = this.model.set(state, {validate: true});

            console.log(isValid);

            if (isValid) {
                isomatic.refreshLayout();
            }

        }
    });

}(isomatic));

