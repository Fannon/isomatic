/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    isomatic.views.ExamplesView = Backbone.View.extend( /** @lends ExportView.prototype */ {

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
            // Delayed Render, triggered via the router!
        },

        /** Render Export View */
        render: function(){
            var source = $('#examples-template').html();
            var template = Handlebars.compile(source);

            var examples = [];

            for (var exampleName in isomatic.options.examples) {
                examples.push({
                    id: exampleName,
                    title: isomatic.options.examples[exampleName].title
                });
            }

            var html = template({
                examples: examples
            });
            this.$el.html(html);
        },

        events: {
            "click .example-thumb": "loadExample"
        },

        loadExample: function(el) {
            var targetExample = el.target.alt;

            if (isomatic.options.examples[targetExample]) {
                var example = isomatic.options.examples[targetExample];

                isomatic.options.ui.set(example.options);
                isomatic.data.raw.set(example.data);

                isomatic.refreshData();

                $('#examples-modal').foundation('reveal', 'close');
            } else {
                console.log('Error loading Example!');
            }

        }

    });


}(isomatic));

