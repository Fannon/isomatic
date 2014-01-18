/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Type View
     *
     * @type {*|void|Object}
     */
    isomatic.views.TypeView = Backbone.View.extend( /** @lends TypeView.prototype */ {

        /**
         * @class TypeView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){
            this.render();
        },
        render: function(){

            var source = $('#type-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                palettes: isomatic.options.internal.colorPalettes
            });

            this.$el.html(html);
        },
        events: {
            "click #color": "colorClick",
            "click .select-type": "selectType"
        },

        /**
         * Selects the clicked on Type, deselects others
         *
         * @param  {Object} e Event Object
         */
        selectType: function(e) {
            var type = e.currentTarget.id.split('-')[0];
            $('.select-type').removeClass('active');
            $(e.currentTarget).addClass('active');
            isomatic.options.ui.set('diagramType', type);
        }
    });

}(isomatic));

