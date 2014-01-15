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
            "type": "type",
            "color": "color",
            "icon": "icon",
            "adjustments": "adjustments",
            "scale": "scale",
            "text": "text"
        },

        /** Home Screen. No Overlays shown */
        home: function() {
            "use strict";
            $(".overlay-container").hide();
            $(".trigger-ui").removeClass('active');
        },

        newGraphic: function() {
        },

        importGraphic: function() {
        },

        exportGraphic: function() {
        },

        help: function() {
        },

        data: function() {
            this.triggerUi('data');
        },

        type: function() {
            this.triggerUi('type');
        },

        color: function() {
            this.triggerUi('color');
        },

        icon: function() {
            this.triggerUi('icon');
        },

        adjustments: function() {
            this.triggerUi('adjustments');
        },

        scale: function() {
            this.triggerUi('scale');
        },

        text: function() {
            this.triggerUi('text');
        },

        ////////////////////////////////////
        // Helper Functions               //
        ////////////////////////////////////

        /**
         * Handles UI Elements
         * @param id
         */
        triggerUi: function(id) {
            "use strict";
            $(".trigger-ui").removeClass('active');
            $(".overlay-container").hide();
            $("#trigger-" + id).addClass('active');
            $('#' + id + '-container').show();
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

