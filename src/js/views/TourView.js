/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    isomatic.views.TourView = Backbone.View.extend( /** @lends TourView.prototype */ {

        /**
         * @class TourView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){
            this.render();

            console.log('test');
        },

        /** Render Tour Modal View */
        render: function(){

            var source = $('#tour-template').html();
            var template = Handlebars.compile(source);
            var html = template();
            this.$el.html(html);
        },


        events: {
            "click #start-tour": "startTour",
            "click #skip-tour": "skipTour"
        },

        /**
         * Applies the currently calculated Aspect Ratio to the Graphic Canvas
         */
        startTour: function() {
            $('#tour-modal').foundation('reveal', 'close');
        },

        skipTour: function() {
            $('#tour-modal').foundation('reveal', 'close');
        }
    });

}(isomatic));

