/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone */


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
        "margin": "margin",
        "scale": "scale",
        "text": "text"
    },

    /** Home Screen. No Overlays shown */
    home: function() {
        "use strict";
        console.log('#home');
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
        console.log('#help');
    },

    data: function() {
        "use strict";
        $(".overlay-container").hide();
        $('#overlay-data').show();
        console.log('#data');
    },

    type: function() {
        "use strict";
        $(".overlay-container").hide();
        $('#overlay-type').show();
        console.log('#type');
    },

    color: function() {
        "use strict";
        $(".overlay-container").hide();
        $('#overlay-color').show();
        console.log('#color');
    },

    icon: function() {
        "use strict";
        $(".overlay-container").hide();
        $('#overlay-icon').show();
        console.log('#icon');
    },

    margin: function() {
        "use strict";
        $(".overlay-container").hide();
        $('#overlay-margin').show();
        console.log('#margin');
    },

    scale: function() {
        "use strict";
        $(".overlay-container").hide();
        $('#overlay-scale').show();
        console.log('#scale');
    },

    text: function() {
        "use strict";
        $(".overlay-container").hide();
        $('#overlay-text').show();
        console.log('#text');
    }
});

/**
 * Isomatic Router
 * @type {AppRouter}
 */
isomatic.router = new IsomaticRouter();


// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();
