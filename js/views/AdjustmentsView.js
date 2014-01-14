/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

/**
 * Properties View
 *
 * @type {*|void|Object}
 */
isomatic.views.AdjustmentsView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        this.render();
    },
    render: function(){
        "use strict";

        var source = $('#adjustments-template').html();
        var template = Handlebars.compile(source);
        var html = template({
            options: isomatic.options.ui.attributes
        });
        this.$el.html(html);

    },
    events: {
        "click #adjustments-apply": "apply",
        "click #adjustments-apply-close": "apply"
    },
    apply: function() {
        "use strict";
        isomatic.views.dataView.submitData();
    }
});
