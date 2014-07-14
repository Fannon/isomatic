/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Tour View
     *
     * @type {*|void|Object}
     */
    isomatic.views.TourView = Backbone.View.extend( /** @lends TourView.prototype */ {

        /**
         * @class TourView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){
            this.render();
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
            "click #close-tour": "closeTour"
        },

        /**
         * Applies the currently calculated Aspect Ratio to the Graphic Canvas
         */

        startTour: function() {
            $.createCookie('tour-viewed', "true", 365);
            $('#tour-modal').foundation('reveal', 'close');
        },

        closeTour: function() {
            $.createCookie('tour-viewed', "true", 365);
            $('#tour-modal').foundation('reveal', 'close');
        }


    });

}(isomatic));

