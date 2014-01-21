/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Icon View
     *
     * @type {*|void|Object}
     */
    isomatic.views.IconView = Backbone.View.extend( /** @lends IconView.prototype */ {

        /**
         * @class IconView
         *
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){

            this.render();

            // Register Model Event Listeners
            this.model.on("change:iconMap", this.render, this);
            this.model.on("change:iconize", this.render, this);
            isomatic.data.meta.on("change:rows", this.render, this);
            isomatic.data.meta.on("change:columns", this.render, this);

        },

        /** Render Icon View */
        render: function(){

            console.info('IconView.render();');

            var iconId, svg;
            var i = 0;
            var iconMapping = {};

            var source = $('#icon-template').html();
            var template = Handlebars.compile(source);
            var iconMap = isomatic.options.ui.attributes.iconMap;

            // Calculate current IconMap
            if (isomatic.options.ui.attributes.iconize === 'column') {
                for (i = 0; i < isomatic.data.meta.attributes.columns.length; i++) {
                    iconId = iconMap[i].split('-');
                    svg = isomatic.icons[iconId[0]].icons[iconId[1]].svg;
                    iconMapping[isomatic.data.meta.attributes.columns[i]] = {};
                    iconMapping[isomatic.data.meta.attributes.columns[i]].svg = svg;
                    iconMapping[isomatic.data.meta.attributes.columns[i]].id = iconMap[i];
                }
            } else {
                for (i = 0; i < isomatic.data.meta.attributes.rows.length; i++) {
                    iconId = iconMap[i].split('-');
                    svg = isomatic.icons[iconId[0]].icons[iconId[1]].svg;
                    iconMapping[isomatic.data.meta.attributes.rows[i]] = {};
                    iconMapping[isomatic.data.meta.attributes.rows[i]].svg = svg;
                    iconMapping[isomatic.data.meta.attributes.rows[i]].id = iconMap[i];
                }
            }

            var html = template({
                options: this.model.attributes,
                iconMapping: iconMapping,
                iconLibrary: isomatic.icons
            });

            this.$el.html(html);

            // Check Column / Row
            if (isomatic.options.ui.attributes.iconize === 'row') {
                $('#iconize-row').attr("checked","checked");
                $('#iconize-column').removeAttr("checked");
            } else {
                $('#iconize-column').attr("checked","checked");
                $('#iconize-row').removeAttr("checked");
            }

            // Display SVG Icons:
            // Take SVG Paths out from helper attribute "svg-content" and parse it into the div
            // SVG can't be parsed with the template engine!
            $('.category-icon, .group-icon').each(
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

        model: isomatic.options.ui,

        currentTarget: null,

        events: {
            "click #iconize-column": "iconizeColumn",
            "click #iconize-row": "iconizeRow",
            "drop .group-container": "handleDrop",
            "dragover .group-container": "allowDrop",
            "dragstart .category-icon": "handleDrag",
            "click #icon-apply": "apply",
            "click #icon-apply-close": "apply"

        },

        /**
         * Applies currently dropped Icons to IconMap
         * Redraws the Graph
         */
        apply: function() {

            var iconMap = [];

            $('.group-container').each(function() {
                var id = $(this).find('svg').attr('class');
                iconMap.push(id);
            });

            isomatic.options.ui.set({
               iconMap: iconMap
            });

            isomatic.refreshDesign();

        },

        /**
         * Set Iconize Mode to Column
         */
        iconizeColumn: function() {
            this.model.set({
                iconize: 'column'
            });
        },

        /**
         * Set Iconize Mode to Row
         */
        iconizeRow: function() {
            this.model.set({
                iconize: 'row'
            });
        },

        /**
         * Drag and Drop allowed
         * @param e
         */
        allowDrop: function(e) {
            e.preventDefault();
        },

        /**
         * Drag and Drop dragging
         * @param e
         */
        handleDrag: function(e) {
            e.originalEvent.dataTransfer.setData("Text", e.target.id);
        },

        /**
         * Drag and Drop dropping
         * @param e
         */
        handleDrop: function(e) {

            var targetContainerId = e.currentTarget.id.split('-')[1];
            var iconId = e.originalEvent.dataTransfer.getData("Text");
            var svgDiv = $(document.getElementById(iconId)).clone().attr('id', 'choice-' + targetContainerId);

            $('#group-' + targetContainerId + ' .group-icon').html(svgDiv);

            e.preventDefault();

        }
    });

}(isomatic));

