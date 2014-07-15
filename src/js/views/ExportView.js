/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    isomatic.views.ExportView = Backbone.View.extend( /** @lends ExportView.prototype */ {

        /**
         * This View is for Exporting the current Graphic to SVG or JSON Files
         * They can optionally be filled with the current Data and Options
         * If they are they can be imported again by the ImportView
         *
         * @class ExportView
         * @augments Backbone.View
         * @contructs
         */
        initialize: function(){
            this.render();
        },

        /** Render Export View */
        render: function(){
            var source = $('#export-template').html();
            var template = Handlebars.compile(source);
            var html = template();
            this.$el.html(html);
        },

        events: {
            "click #start-export": "startExport",
            "click .select-format": "selectFormat"
        },

        /** Currently selected Export-Format. Defaults to SVG Export */
        selectedFormat: 'svg',

        /**
         * Select an isotype format
         * @param e
         */
        selectFormat: function(e) {
            var type = e.currentTarget.id;
            $('.select-format').addClass('disabled');
            $(e.currentTarget).removeClass('disabled');

            if (type === 'format-svg') {
                this.selectedFormat = 'svg';
                $('#export-modal input').removeAttr('disabled');
            } else {
                this.selectedFormat = 'json';
                $('#export-modal input').attr('disabled', true);
            }

        },

        /**
         * Start the export of a svg and/or json
         */
        startExport: function() {
            if (this.selectedFormat === 'svg') {
                this.exportSVG();
            } else {
                this.exportJSON();
            }
        },

        /**
         * Exports current Graphic as SVG
         * Embeds current Options and Data, too.
         */
        exportSVG: function() {

//            console.log('ExportView.exportSVG();');

            this.embedData();

            var content = '<?xml version="1.0" encoding="utf-8"?>\n';
            content += '<!-- Generator: isomatic (http://www.isomatic.de) -->\n';
            content += $('#graph').html();

            var filename = isomatic.getFormattedTime() + ".svg";

            $.generateFile({
                filename: filename,
                content: content,
                script: 'http://svg-generator.de/download.php'
            });

        },

        /**
         * Exports Options and Data as JSON Object
         */
        exportJSON: function() {

//            console.log('ExportView.exportJSON();');

            var content = this.embedData();
            var filename = isomatic.getFormattedTime() + ".json";

            $.generateFile({
                filename: filename,
                content: content,
                script: 'http://svg-generator.de/download.php'
            });
        },

        /**
         * Embeds current Options and Data into the SVG
         * Helper Function
         */
        embedData: function() {

//            console.log('ExportView.embedData();');

            var data = '';
            var options = '';

            if ($('#export-data').is(':checked')) {
                data = isomatic.data.raw.get('data');
            }

            if ($('#export-options').is(':checked')) {
                options = isomatic.options.ui.toJSON();
            }

            var jsonExport = {
                data: data,
                options: options
            };

            var jsonStringExport = JSON.stringify(jsonExport, null, 2);

            // Check if description tag already exists. If not create it, otherwise update it.
            var desc = $('#isomatic-metadata');
            if (desc.length === 0) {
                isomatic.views.graphView.svg.append("desc")
                    .attr("id", "isomatic-metadata")
                    .text(jsonStringExport);
            } else {
                desc.text(jsonStringExport);
            }

            return jsonStringExport;
        }
    });


}(isomatic));

