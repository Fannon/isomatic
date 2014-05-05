/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Help View
     *
     * @type {*|void|Object}
     */
    isomatic.views.DataHelpView = Backbone.View.extend( /** @lends DataHelpView.prototype */ {

        /**
         * @class DataHelpView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){
            this.render();
        },

        /**
         * Render Data Help View
         */
        render: function(){

            var source = $('#datahelp-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                palettes: isomatic.options.internal.colorPalettes
            });
            this.$el.html(html);

        },
        events: {

        }
    });

}(isomatic));

