/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _ */

/**
 * Data View
 *
 * @type {*|void|Object}
 */
isomatic.views.ExportView = Backbone.View.extend({

    /** Init Export View */
    initialize: function(){
        "use strict";
        console.log('ExportView init');

        this.render();

        var self = this;

        $("#startExport" ).on("click", function() {
            self.exportSVG();
        });
    },

    /** Render Export View */
    render: function(){
        "use strict";

        // Compile the template using underscore
        var template = _.template( $("#export_template").html());

        // Load the compiled HTML into the Backbone "el"
        this.$el.html(template);

        console.dir(this.$el);
    },
    events: {
        // TODO: Not working, no idea why
        "click #startExport": "exportSVG"
    },

    /**
     * Exports current Graphic as SVG
     * Embeds current Options and Data, too.
     */
    exportSVG: function() {
        "use strict";

        console.log('ExportView.exportSVG();');

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
        "use strict";

        console.log('ExportView.exportJSON();');

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
        "use strict";

        console.log('ExportView.embedData();');

        var jsonExport = {
            data: isomatic.data.raw,
            options: isomatic.options.ui.toJSON()
        };

        var jsonStringExport = JSON.stringify(jsonExport, null, 2);

        // Check if description tag already exists. If not create it, otherwise update it.
        var desc = $('#isomatic-metadata');
        if (desc.length === 0) {
            isomatic.vis.svg.append("desc")
                .attr("id", "isomatic-metadata")
                .text(jsonStringExport);
        } else {
            desc.text(jsonStringExport);
        }

        return jsonStringExport;
    }
});
