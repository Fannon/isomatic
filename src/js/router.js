/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone */

(function(isomatic) {
    "use strict";

    /**
     * Isomatic Routing
     * Defines all App Routes
     */
    var IsomaticRouter = Backbone.Router.extend({

        routes: {
            "home": "home",
            "new": "newGraphic",
            "import": "importGraphic",
            "export": "exportGraphic",
            "help": "help",
            "data": "data",
            "datahelp": "datahelp",
            "type": "type",
            "color": "color",
            "icon": "icon",
            "adjustments": "adjustments",
            "scale": "scale",
            "text": "text"
        },

        /** Home Screen. No Overlays shown */
        home: function() {
            $(".overlay-container").hide();
            $(".trigger-ui").removeClass('active');
            $('#graph').removeClass('move-right');
        },

        newGraphic: function() {
            // Modal
        },

        importGraphic: function() {
            // Modal
        },

        exportGraphic: function() {
            // Modal
        },

        help: function() {
            // Modal
        },

        data: function() {
            this.triggerUi('data', true);
        },

        datahelp: function() {
            this.triggerUi('datahelp',false);
        },

        type: function() {
            this.triggerUi('type', false);
        },

        color: function() {
            this.triggerUi('color', true);
        },

        icon: function() {
            this.triggerUi('icon', true);
        },

        adjustments: function() {
            this.triggerUi('adjustments', false);
        },

        scale: function() {
            this.triggerUi('scale', false);
        },

        text: function() {
            this.triggerUi('text', false);
        },

        ////////////////////////////////////
        // Helper Functions               //
        ////////////////////////////////////

        /**
         * Handles UI Elements
         * @param id
         */
        triggerUi: function(id, isBig) {
            $(".trigger-ui").removeClass('active');
            $(".overlay-container").hide();
            $("#trigger-" + id).addClass('active');
            $('#' + id + '-container').show();

            if (!isBig) {
                $('#graph').addClass('move-right');
            }

        }
    });

    /**
     * Isomatic Router
     * @type {AppRouter}
     */
    isomatic.router = new IsomaticRouter();


    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

}(isomatic));

