/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Import View
     *
     * @type {*|void|Object}
     */
    isomatic.views.NewView = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){
            var source = $('#new-template').html();
            var template = Handlebars.compile(source);
            var html = template();
            this.$el.html(html);

            Backbone.Validation.bind(this);
        },

        /**
         * Options.ui Model
         */
        model: isomatic.options.ui,

        events: {
            "click #new-apply": "apply"
        },

        apply: function() {

            console.log('generateNewGraphic');

            var aspectRatio = $('#aspect-ratio').val();
            if (aspectRatio.contains('/')) {
                var temp = aspectRatio.split('/');
                aspectRatio = temp[0] / temp[1];
            }

            console.log('AspectRatio: ' + aspectRatio);

            var state = {
                'aspectRatio': aspectRatio
            };

            console.dir(state);

            var isValid = this.model.set(state, {validate: true});

            if (isValid) {
                isomatic.refreshLayout();
            }

        }
    });

}(isomatic));

