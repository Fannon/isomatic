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

            var advancedOptions = false;
            if (isomatic.options.ui.attributes.diagramType !== 'normal') {
                advancedOptions = true;
            }

            var html = template({
                palettes: isomatic.options.internal.colorPalettes,
                advancedOptions: advancedOptions
            });

            this.$el.html(html);

            // Init Scrollbar
            try {
                var slimScrollOptions = {
                    height: isomatic.options.ui.attributes.graphHeight - 40,
                    alwaysVisible: true,
                    railVisible: true,
                    color: '#EEE',
                    railColor: '#222',
                    railOpacity: 1
                };

                $('#help-container .scrollbar').slimScroll(slimScrollOptions);

                slimScrollOptions.height = isomatic.options.ui.attributes.graphHeight - 80;

                $('#help-container .scrollbar-tour').slimScroll(slimScrollOptions);

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

            // Highlight according UI Element on the left side
            $('.highlightable').removeClass('highlight');
            $('.' + id + '-highlight').addClass('highlight');
        }
    });

}(isomatic));

