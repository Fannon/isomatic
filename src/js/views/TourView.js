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
            "click #start-tour": "tourModal",
            "click #close-tour": "tourModal"
        },

        /**
         * Close the tour popup and set a cookie
         */
        tourModal: function() {
            $.createCookie('tour-viewed', "true", 365);
            $('#tour-modal').foundation('reveal', 'close');
        }


    });

}(isomatic));

