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
            "examples-help": "exampleshelp",
            "new": "newGraphic",
            "new-help": "newhelp",
            "import": "importGraphic",
            "import-help": "importhelp",
            "export": "exportGraphic",
            "export-help": "exporthelp",
            "examples": "examples",
            "tour": "tour",
            "help": "help",
            "help-overview": "helpoverview",
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

        exampleshelp: function() {
            this.redirect('examples');
        },

        newGraphic: function() {
            $('#new-modal').foundation('reveal', 'open');
        },

        newhelp: function() {
            this.redirect('new');
        },

        importGraphic: function() {
            $('#import-modal').foundation('reveal', 'open');
        },

        importhelp: function() {
            this.redirect('import');
        },

        exportGraphic: function() {
            $('#export-modal').foundation('reveal', 'open');
        },

        exporthelp: function() {
            this.redirect('export');
        },

        examples: function() {
            isomatic.views.examplesView.render();
            $('#examples-modal').foundation('reveal', 'open');
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
            // Look if help was activated from the homescreen
            if (isomatic.options.internal.HelpStatus.location === 'home' && isomatic.options.internal.HelpStatus.active === false) {
                isomatic.options.internal.HelpStatus.active = true;
                window.location = '#help-overview';
            } else {
                this.showHelp();
                this.checkHelp();
            }
        },

        helpoverview: function() {
            $('#graph').removeClass('move-right');
            this.redirect('home');
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

        /**
         * Toggles the help active state
         */
        showHelp: function() {
            if (isomatic.options.internal.HelpStatus.active) {
                isomatic.options.internal.HelpStatus.active = false;
            } else {
                isomatic.options.internal.HelpStatus.active = true;
            }
        },

        /**
         * Toggles the help container and set window.location
         */
        checkHelp: function() {
            // Init Image Lazy Loading (unveil.js)
            $("img").unveil();

            // Remove all help container and highlights from the DOM
            $('.help-section').hide();
            $('#help-container').hide();
            $('.highlightable').removeClass('highlight');

            // Show the help container of the current location and the highlight of the first option
            if (isomatic.options.internal.HelpStatus.active === true) {
                $('#help-container').show();
                $('#' + isomatic.options.internal.HelpStatus.location + '-help').show();
                $('#' + isomatic.options.internal.HelpStatus.location + '-container .highlightable').first().addClass('highlight');
            }
            $('#' + isomatic.options.internal.HelpStatus.location + '-help .help-option-nav').removeClass('active').first().addClass('active');
            $('#' + isomatic.options.internal.HelpStatus.location + '-help .help-right-option-container').hide().first().show();

            // Set window URL
            window.location = '#' + isomatic.options.internal.HelpStatus.location;
        },

        /**
         * Show help container without location taps (e.g. import)
         * @param route
         */
        redirect: function(route) {
            $(".trigger-ui").removeClass('active');
            $(".overlay-container").hide();
            isomatic.options.internal.HelpStatus.location = 'home';
            $("#help-container").show();
            $('.help-section').hide();
            $('#' + route + '-help').show();
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

