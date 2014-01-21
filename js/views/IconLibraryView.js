/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Icon View
     *
     * @type {*|void|Object}
     */
    isomatic.views.IconLibraryView = Backbone.View.extend( /** @lends IconLibraryView.prototype */ {

        /**
         * @class IconLibraryView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){

            this.render();

        },

        /** Render Icon View */
        render: function(){

            console.info('IconLibraryView.render();');

            var source = $('#icon-right-template').html();
            var template = Handlebars.compile(source);

            var html = template({
                iconLibrary: isomatic.icons
            });

            this.$el.html(html);

            // Display SVG Icons:
            // Take SVG Paths out from helper attribute "svg-content" and parse it into the div
            // SVG can't be parsed with the template engine!
            $('.category-icon').each(
                function(){
                    var el = $(this);
                    var content = el.attr('svg-content');
                    var id = el.attr('id').split('-');
                    el.html('<svg class="' + id[1] + '-' + id[2] + '"><g>' + content + '</g></svg>');
                    el.removeAttr('svg-content');
                }
            );

            // Init Scrollbar
            $('.scrollbar').slimScroll({
                'height': isomatic.options.ui.attributes.graphHeight
            });

        },

        model: isomatic.icons,

        currentTarget: null,

        events: {
            "dragstart .category-icon": "handleDrag"
        },

        /**
         * Drag and Drop dragging
         * @param e
         */
        handleDrag: function(e) {
            e.originalEvent.dataTransfer.setData("Text", e.target.id);
        }

    });

}(isomatic));

