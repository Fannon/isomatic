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

            var source = $('#icon-template').html();
            var template = Handlebars.compile(source);

            // Calculate current Colormap
            var iconMap = {};
            var i = 0;
            if (isomatic.options.ui.attributes.iconize === 'row') {
                for (i = 0; i < isomatic.data.meta.attributes.columns.length; i++) {
                    var svg = isomatic.icons[isomatic.options.ui.attributes.iconMap[i].category].icons[isomatic.options.ui.attributes.iconMap[i].name].svg;

                    iconMap[isomatic.data.meta.attributes.columns[i]] = svg;
                }
            } else {
                for (i = 0; i < isomatic.data.meta.attributes.rows.length; i++) {
                    iconMap[isomatic.data.meta.attributes.rows[i]] = isomatic.options.ui.attributes.iconMap[i];
                }
            }

            var html = template({
                options: this.model.attributes,
                iconMap: iconMap,
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

            $('.category-icon').each(
                function(){
                    var el = $(this);
                    var content = el.attr('content');
                    el.html('<svg><g>' + content + '</g></svg>');
                    el.removeAttr('content');
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
            "drop .group-icon": "handleDrop",
            "dragover .group-icon": "allowDrop",
            "dragstart .category-icon": "handleDrag",
            "click #iconize-apply": "apply",
            "click #iconize-apply-close": "apply"

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

            console.log(e.target);

            var targetContainer = e.currentTarget.id.split('-')[1];

            e.preventDefault();
            var data = e.originalEvent.dataTransfer.getData("Text");

            if ($(e.target).children.length > 0) {
                $(document.getElementById("choice")).remove();
            }

            $(document.getElementById(data)).clone().attr('id', 'choice-' + targetContainer).appendTo(e.target);
            $('#choice-' + targetContainer).addClass("smallIcon");

//            var mySvg = document.querySelector("#choise-" + targetContainer);
//            console.log(mySvg);


//            myPath.setAttribute('class', 'container-' + targetContainer);
//            mySvg.setAttribute('class', 'container-' + targetContainer);

        }
    });

}(isomatic));

