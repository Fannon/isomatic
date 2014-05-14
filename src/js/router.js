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
            $(".overlay-container").hide();
            $(".trigger-ui").removeClass('active');
            $('#graph').removeClass('move-right');
            this.checkHelp();
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

        data: function() {
            this.triggerUi('data', true);
            this.checkHelp();
        },

        type: function() {
            this.triggerUi('type', false);
            this.checkHelp();
        },

        color: function() {
            this.triggerUi('color', true);
            this.checkHelp();
        },

        icon: function() {
            this.triggerUi('icon', true);
            this.checkHelp();
        },

        adjustments: function() {
            this.triggerUi('adjustments', false);
            this.checkHelp();
        },

        scale: function() {
            this.triggerUi('scale', false);
            this.checkHelp();
        },

        text: function() {
            this.triggerUi('text', false);
            this.checkHelp();
        },

        help: function() {
            this.showHelp();
            this.checkHelp();
        },

        ////////////////////////////////////
        // Helper Functions               //
        ////////////////////////////////////

        /**
         * Handles UI Elements
         * @param id
         */
        triggerUi: function(id, isBig) {
            this.checkHelp();
            $(".trigger-ui").removeClass('active');
            $(".overlay-container").hide();
            $('#graph').removeClass('move-right');
            $("#trigger-" + id).addClass('active');
            $('#' + id + '-container').show();

            if (!isBig) {
                $('#graph').addClass('move-right');
            }

        },

        checkHelp: function() {
            if (isomatic.options.internal.HelpStatus.active === true) {
                $('#help-container').show();
            } else {
                $('#help-container').hide();
            }
        },

        showHelp: function() {
            if (isomatic.options.internal.HelpStatus.active) {
                isomatic.options.internal.HelpStatus.active = false;
            } else {
                isomatic.options.internal.HelpStatus.active = true;
            }

            console.log("helpactive: " + isomatic.options.internal.HelpStatus.active);
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

