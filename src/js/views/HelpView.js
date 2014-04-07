/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Help View
     *
     * @type {*|void|Object}
     */
    isomatic.views.HelpView = Backbone.View.extend( /** @lends HelpView.prototype */ {

        /**
         * @class HelpView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){
            this.render();
        },

        /**
         * Render Help View
         */
        render: function(){

            var source = $('#help-template').html();
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

