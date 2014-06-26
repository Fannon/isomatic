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
            "tour": "tour",
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
            isomatic.options.internal.HelpStatus.active = false;
            isomatic.options.internal.HelpStatus.location = 'home';
            this.checkHelp();
        },

        newGraphic: function() {
            $('#new-modal').foundation('reveal', 'open');
        },

        importGraphic: function() {
            $('#import-modal').foundation('reveal', 'open');
        },

        exportGraphic: function() {
            $('#export-modal').foundation('reveal', 'open');
        },

        tour: function() {
            $('#tour-modal').foundation('reveal', 'open');
        },

        data: function() {
            this.triggerUi('data', true);
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
            $(".trigger-ui").removeClass('active');
            $(".overlay-container").hide();
            $('#graph').removeClass('move-right');
            $("#trigger-" + id).addClass('active');
            $('#' + id + '-container').show();
            isomatic.options.internal.HelpStatus.location = id;

            if (!isBig) {
                $('#graph').addClass('move-right');
            }
            this.checkHelp();

        },

        showHelp: function() {
            if (isomatic.options.internal.HelpStatus.active) {
                isomatic.options.internal.HelpStatus.active = false;
            } else {
                isomatic.options.internal.HelpStatus.active = true;
            }
        },

        checkHelp: function() {
            $('.help-section').hide();
            $('#help-container').hide();
            $('.highlightable').removeClass('highlight');
            if (isomatic.options.internal.HelpStatus.active === true) {
                $('#help-container').show();
                $('#' + isomatic.options.internal.HelpStatus.location + '-help').show();
                $('#' + isomatic.options.internal.HelpStatus.location + '-container .highlightable').first().addClass('highlight');
            } else {
                $('#' + isomatic.options.internal.HelpStatus.location + '-help .help-option-nav').removeClass('active').first().addClass('active');
                $('#' + isomatic.options.internal.HelpStatus.location + '-help .help-right-option-container').hide().first().show();

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

