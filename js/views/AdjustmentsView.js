/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */
(function(isomatic) {
    "use strict";

    /**
     * Properties View
     *
     * @type {*|void|Object}
     */
    isomatic.views.AdjustmentsView = Backbone.View.extend({

        initialize: function(){

            this.render();

            // Register Model Event Listeners
            this.model.on("change:outerMargin", this.render, this);
            this.model.on("change:iconHorizontalMargin", this.render, this);
            this.model.on("change:rowMargin", this.render, this);
            this.model.on("change:columnMargin", this.render, this);
            this.model.on("change:iconSize", this.render, this);

        },
        render: function(){

            var source = $('#adjustments-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                options: this.model.attributes
            });
            this.$el.html(html);

        },

        model: isomatic.options.ui,

        events: {
            "click #adjustments-apply": "apply",
            "click #adjustments-apply-close": "apply",
            'change input#outer-margin': 'changeOuterMargin',
            'change input#icon-horizontal-margin': 'changeIconHorizontalMargin',
            'change input#row-margin': 'changeRowMargin',
            'change input#column-margin': 'changeColumnMargin',
            'change input#icon-size': 'changeIconSize'

        },
        apply: function() {
            isomatic.refreshLayout();
        },
        changeOuterMargin: function(e) {
            var val = $(e.currentTarget).val();
            this.model.set({'outerMargin': val});
        },

        changeIconHorizontalMargin: function(e) {
            var val = $(e.currentTarget).val();
            this.model.set({'iconHorizontalMargin': val});
        },

        changeRowMargin: function(e) {
            var val = $(e.currentTarget).val();
            this.model.set({'rowMargin': val});
        },

        changeColumnMargin: function(e) {
            var val = $(e.currentTarget).val();
            this.model.set({'columnMargin': val});
        },

        changeIconSize: function(e) {
            var val = $(e.currentTarget).val();
            this.model.set({'iconSize': val});
        }
    });

}(isomatic));

