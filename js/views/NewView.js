/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * New Graphic View
     *
     * @type {*|void|Object}
     */
    isomatic.views.NewView = Backbone.View.extend( /** @lends NewView.prototype */ {

        /**
         * @class NewView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){
            this.render();
        },

        /** Render New Graphic View */
        render: function(){

            console.info('NewView.render();');

            var source = $('#new-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                options: isomatic.options.ui.attributes
            });
            this.$el.html(html);

            Backbone.Validation.bind(this);

            // Register Model Event Listeners
            this.model.on("change:aspectRatio", this.render, this);


        },

        /**
         * Options.ui Model
         */
        model: isomatic.options.ui,

        events: {
            "click #new-apply": "apply",
            "click #new-apply-close": "apply",
            "change #aspect-ratio": "changeAspectRatio",
            "change #aspect-ratio-width": "changeAspectRatioSizing",
            "change #aspect-ratio-height": "changeAspectRatioSizing"
        },

        /**
         * Applies the currently calculated Aspect Ratio to the Graphic Canvas
         */
        apply: function() {

            console.log('generateNewGraphic');

            var aspectRatio = this.getAspectRatio();

            var state = {
                'aspectRatio': aspectRatio
            };

            var isValid = this.model.set(state, {validate: true});

            if (isValid) {
                isomatic.refreshLayout();
            }

        },

        /**
         * Triggered if Aspect Ratio is changed. Adjusts Height
         */
        changeAspectRatio: function() {
            var aspectRatio = this.getAspectRatio();
            var width = $('#aspect-ratio-width').val();
            var height = width / aspectRatio;
            $('#aspect-ratio-height').val(height);
        },

        /**
         * Triggered if Width or Height is changed. Adjusts Aspect Ratio
         */
        changeAspectRatioSizing: function() {
            var width = $('#aspect-ratio-width').val();
            var height = $('#aspect-ratio-height').val();

            $('#aspect-ratio').val(width / height);
        },

        /**
         * Gets and calculates current Aspect Ratio
         * If an Fraction is entered (16/9), the Ratio will be calculated
         *
         * @return {Float} Aspect Ratio Float
         */
        getAspectRatio: function() {
            var aspectRatio = $('#aspect-ratio').val();
            if (aspectRatio.contains('/')) {
                var temp = aspectRatio.split('/');
                aspectRatio = temp[0] / temp[1];
            }

            console.log('AspectRatio: ' + aspectRatio);

            return aspectRatio;
        }
    });

}(isomatic));

