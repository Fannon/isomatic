/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone */

isomatic.views.TypeView = Backbone.View.extend({

    events: {
        "overlay-type .save":          "save"
    },

    initialize: function() {
        "use strict";

        this.listenTo(this.model, "change", this.render);
    },

    save: function() {
        "use strict";

        // TODO: Validation
        // TODO: Write to Model
    },

    render: function() {
        "use strict";

        // TODO: Update Form Elements via jQuery

        return this;
    }

});

