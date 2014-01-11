/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _ */

/**
 * Graph View
 *
 * @type {*|void|Object}
 */
isomatic.views.GraphView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        console.log('NewView init');
        this.render();

        // Init Visualisation
        isomatic.vis.init();
    },
    render: function(){
        "use strict";
        this.$el.html('<div id="graph"></div>');
    },
    events: {
        "click #graph": "graphClick"
    },

    /**
     * If the graph is clicked, close all Overlays
     */
    graphClick: function() {
        "use strict";
        console.log('#Graph click!');
        window.location = '#home';
    }
});
