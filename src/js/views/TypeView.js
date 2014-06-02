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

            // Set current Type active
            var currentType = isomatic.options.ui.get('diagramType');
            $('.select-type').removeClass('active');
            $('#' + currentType + '-isotype').addClass('active');
        },
        render: function(){

            var advancedOptions = false;

            if (isomatic.options.ui.attributes.diagramType !== 'normal') {
                advancedOptions = true;
            }
            
            var source = $('#type-template').html();
            var template = Handlebars.compile(source);
            var html = template({
                type: isomatic.options.ui.attributes.diagramType,
                equallyDistributedColumns: isomatic.options.ui.attributes.equallyDistributedColumns,
                advancedOptions: advancedOptions
            });

            this.$el.html(html);

        },
        events: {
            "click .select-type": "selectType",
            "click #equally-distributed-columns": "selectColumnDistribution"
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
            isomatic.refreshLayout();
            this.initialize();
        },

        selectColumnDistribution: function(e) {
            var checked = $('#equally-distributed-columns').prop('checked');

            isomatic.options.ui.set('equallyDistributedColumns', checked);
            isomatic.refreshLayout();
        }
    });

}(isomatic));

