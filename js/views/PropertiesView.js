/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

/**
 * Properties View
 *
 * @type {*|void|Object}
 */
isomatic.views.PropertiesView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        this.render();
    },
    render: function(){
        "use strict";

        var source = $('#properties-template').html();
        var template = Handlebars.compile(source);
        var html = template({
            options: isomatic.options.ui.attributes
        });
        this.$el.html(html);

    },
    events: {
        "click #color": "colorClick"
    },
    model: isomatic.options.ui
});
