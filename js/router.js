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
        console.log('#data');
    },

    type: function() {
        "use strict";
        console.log('#type');
    },

    color: function() {
        "use strict";
        console.log('#color');
    },

    icon: function() {
        "use strict";
        console.log('#icon');
    },

    margin: function() {
        "use strict";
        console.log('#margin');
    },

    scale: function() {
        "use strict";
        console.log('#scale');
    },

    text: function() {
        "use strict";
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
