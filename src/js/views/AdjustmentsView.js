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
            this.model.on("change:diagramType", this.render, this);

        },

        /**
         * Render Adjustment View
         */
        render: function(){

            var source = $('#adjustments-template').html();
            var template = Handlebars.compile(source);

            var advancedOptions = false;
            if (isomatic.options.ui.attributes.diagramType !== 'normal') {
                advancedOptions = true;
            }

            var html = template({
                options: this.model.attributes,
                advancedOptions: advancedOptions
            });

            this.$el.html(html);

            Backbone.Validation.bind(this);

            this.activateIconSize();

            // Init Scrollbar
            try {
                var slimScrollOptions = isomatic.options.internal.slimScrollOptions;
                slimScrollOptions.height = isomatic.options.ui.attributes.graphHeight - 80;
                $('#adjustments-container .scrollbar').slimScroll(slimScrollOptions);
            } catch (e) {
                console.error('Error loading Scrollbar Plugin!');
            }

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
            "click #adjustments-apply-close": "apply",
            "click #auto-icon-size": "activateIconSize",
            "keydown input": "keyDown"
        },

        /**
         * Register the enter key in input fields
         * @param e
         */
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
                'outerMargin': $('#outer-margin').val(),
                'iconHorizontalMargin': $('#icon-horizontal-margin').val(),
                'iconVerticalMargin': $('#icon-vertical-margin').val() || 0,
                'rowMargin': $('#row-margin').val(),
                'columnMargin': $('#column-margin').val() || 0,
                'iconSize': $('#icon-size').val(),
                'autoIconSize': $('#auto-icon-size').prop('checked')
            };

            var isValid = this.model.set(state, {validate: true});

            if (isValid) {
                isomatic.refreshData();
            }

        },

        /**
         * Activate the automatic icon size
         */
        activateIconSize: function() {
            if ($('#auto-icon-size').prop('checked')) {
                $('#icon-size').prop("disabled", true);
            } else {
                $('#icon-size').prop("disabled", false);
            }
        }

    });

}(isomatic));

