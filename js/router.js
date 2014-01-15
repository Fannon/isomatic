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
            "use strict";
            console.log('#new');
        },

        importGraphic: function() {
            "use strict";
            console.log('#import');
        },

        exportGraphic: function() {
            "use strict";
            console.log('#export');
        },

        help: function() {
            "use strict";
            this.triggerUi('help');
        },

        data: function() {
            "use strict";
            this.triggerUi('data');
        },

        type: function() {
            "use strict";
            this.triggerUi('type');
        },

        color: function() {
            "use strict";
            this.triggerUi('color');
        },

        icon: function() {
            "use strict";
            this.triggerUi('icon');
        },

        adjustments: function() {
            "use strict";
            this.triggerUi('adjustments');
        },

        scale: function() {
            "use strict";
            this.triggerUi('scale');
        },

        text: function() {
            "use strict";
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

