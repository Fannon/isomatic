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

            // Init Scrollbar
            try {
                var slimScrollOptions = isomatic.options.internal.slimScrollOptions;

                slimScrollOptions.height = isomatic.options.ui.attributes.graphHeight - 80;
                $('#help-container .scrollbar').slimScroll(slimScrollOptions);
            } catch (e) {
                console.error('Error loading Scrollbar Plugin!');
            }

        },
        events: {
            "click .help-option-nav": "setNavigation"
        },

        setNavigation: function(e) {
            console.log("setNavigation");
            var id = e.currentTarget.id;
            $('.help-option-nav').removeClass("active");
            $('#' + id).addClass("active");
            $('.help-right-option-container').hide();
            $('#' + id + '-container').show();
        }

    });

}(isomatic));

