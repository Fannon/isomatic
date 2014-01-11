/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

/**
 * Color View
 *
 * @type {*|void|Object}
 */
isomatic.views.ColorView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        console.log('NewView init');
        this.render();

        // Init Visualisation
        isomatic.vis.init();
    },
    render: function(){
        "use strict";

        var source = $('#color-template').html();
        var template = Handlebars.compile(source);
        var html = template({
            palettes: isomatic.options.internal.colorPalettes
        });
        this.$el.html(html);

    },
    events: {
        "click #color": "colorClick"
    },

    /**
     * If the graph is clicked, close all Overlays
     */
    colorClick: function() {
        "use strict";
        console.log('#Color click!');
        window.location = '#home';
    }
});
