/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Properties View
     *
     * @type {*|void|Object}
     */
    isomatic.views.AdjustmentsView = Backbone.View.extend({

        /**
         * Init Adjustment View
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
            // 'change input#outer-margin': 'changeOuterMargin',
            // 'change input#icon-horizontal-margin': 'changeIconHorizontalMargin',
            // 'change input#row-margin': 'changeRowMargin',
            // 'change input#column-margin': 'changeColumnMargin',
            // 'change input#icon-size': 'changeIconSize'

        },

        /**
         * Apply Adjustments to Graphic
         */
        apply: function() {

            var state = {
                'outerMargin': $('#outer-margin').val(),
                'iconHorizontalMargin': $('#icon-horizontal-margin').val(),
                'rowMargin': $('#row-margin').val(),
                'columnMargin': $('#column-margin').val(),
                'iconSize': $('#icon-size').val()
            };

//            var isValid = this.model.set({
//                'outerMargin': Math.round($('#outer-margin').val()),
//                'iconHorizontalMargin': parseInt($('#icon-horizontal-margin').val(), 10),
//                'rowMargin': parseInt($('#row-margin').val(), 10),
//                'columnMargin': parseInt($('#column-margin').val(), 10),
//                'iconSize': parseInt($('#icon-size').val(), 10)
//            }, {
//                validate : true
//            });

            var isValid = this.model.set(state, {validate: true});

            if (isValid) {
                isomatic.refreshLayout();
            }

        }

        /**
         * Change Outer Margin
         * @param e
         */
        // changeOuterMargin: function(e) {
        //     var val = $(e.currentTarget).val();
        //     this.model.set({'outerMargin': val});
        // },

        // changeIconHorizontalMargin: function(e) {
        //     var val = $(e.currentTarget).val();
        //     this.model.set({'iconHorizontalMargin': val});
        // },

        // changeRowMargin: function(e) {
        //     var val = $(e.currentTarget).val();
        //     this.model.set({'rowMargin': val});
        // },

        // changeColumnMargin: function(e) {
        //     var val = $(e.currentTarget).val();
        //     this.model.set({'columnMargin': val});
        // },

        // changeIconSize: function(e) {
        //     var val = $(e.currentTarget).val();
        //     this.model.set({'iconSize': val});
        // }

    });

}(isomatic));

