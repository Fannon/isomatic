/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Scale View
     *
     * @type {*|void|Object}
     */
    isomatic.views.ScaleView = Backbone.View.extend( /** @lends ScaleView.prototype */ {

        /**
         * @class ScaleView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){
            this.render();

            // Register Model Event Listeners
            this.model.on("change:scale", this.render, this);
            this.model.on("change:roundUp", this.render, this);
            this.model.on("change:roundDown", this.render, this);

        },
        render: function(){

            console.info('ScaleView.render();');

            var source = $('#scale-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                options: this.model.attributes
            });
            this.$el.html(html);

        },
        model: isomatic.options.ui,
        events: {
            "click #scale-apply": "apply",
            "click #scale-apply-close": "apply"
        },

        /**
         * Apply Scales to Graphic
         */
        apply: function() {

            var state = {
                'scale': $('#scale').val(),
                'roundUp': $('#round-up').val(),
                'roundDown': $('#round-down').val()
            };

            var isValid = this.model.set(state, {validate: true});

            if (isValid) {
                isomatic.refreshLayout();
            }

        }
    });

}(isomatic));

