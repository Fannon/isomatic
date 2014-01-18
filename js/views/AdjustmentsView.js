/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Adjustments View
     *
     * @type {*|void|Object}
     */
    isomatic.views.AdjustmentsView = Backbone.View.extend( /** @lends AdjustmentsView.prototype */ {

        /**
         * @class AdjustmentsView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){

            this.render();

            // Register Model Event Listeners
            this.model.on("change:outerMargin", this.render, this);
            this.model.on("change:iconHorizontalMargin", this.render, this);
            this.model.on("change:rowMargin", this.render, this);
            this.model.on("change:columnMargin", this.render, this);
            this.model.on("change:iconSize", this.render, this);

        },

        /**
         * Render Adjustment View
         */
        render: function(){

            console.info('AdjustmentsView.render();');

            var source = $('#adjustments-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                options: this.model.attributes
            });

            this.$el.html(html);

            Backbone.Validation.bind(this);

        },

        /**
         * Options.ui Model
         */
        model: isomatic.options.ui,

        /**
         * Adjustment View UI Events
         */
        events: {
            "click #adjustments-apply": "apply",
            "click #adjustments-apply-close": "apply"
        },

        /**
         * Apply Adjustments to Graphic
         */
        apply: function() {

            var state = {
                'outerMargin': $('#outer-margin').val(),
                'iconHorizontalMargin': $('#icon-horizontal-margin').val(),
                'rowMargin': $('#row-margin').val(),
//                'columnMargin': $('#column-margin').val(),
                'iconSize': $('#icon-size').val()
            };

            var isValid = this.model.set(state, {validate: true});

            if (isValid) {
                isomatic.refreshLayout();
            }

        }

    });

}(isomatic));

