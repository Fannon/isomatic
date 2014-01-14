/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

/**
 * Icon View
 *
 * @type {*|void|Object}
 */
isomatic.views.IconView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        this.render();
    },
    render: function(){
        "use strict";

        var source = $('#icon-template').html();
        var template = Handlebars.compile(source);
        var html = template({
            palettes: isomatic.options.internal.colorPalettes
        });
        this.$el.html(html);

    },
    events: {
        "click #color": "colorClick",
        "dragstart .category-icon": "handleDragStart",
        "dragend .category-icon": "handleDragEnd",
        "drop .category-icon": "handleDrop"
    },
    currentTarget: null,
    handleDragStart: function(e) {
        "use strict";
        $(e.currentTarget).addClass('dragging');
    },
    handleDragEnd: function(e) {
        "use strict";
        //todo mapping with image-lib
        $('.category-icon').removeClass('active');
        $(e.currentTarget).removeClass('dragging');
        $(e.currentTarget).addClass('active');
    },
    handleDrop: function(e) {
        "use strict";

    }

});
