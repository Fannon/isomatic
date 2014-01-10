/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _ */

/**
 * Import View
 *
 * @type {*|void|Object}
 */
isomatic.views.ImportView = Backbone.View.extend({
    initialize: function(){
        "use strict";
        console.log('ImportView init');
        this.render();

        // Set Up FileUpload Listener
        $('#imported-file')[0].addEventListener("change", function(event) {

            var file = event.target.files[0];
            console.dir(file);

            //////////////////////////////////////
            // Identify File Type               //
            //////////////////////////////////////

            console.log('Filetype: ' + file.type);
            // Only process image files.
            if (file.type === 'image/svg+xml') {
                // TODO: Handle SVG File
            } else {
                // TODO: Handle JSON File (no type)
            }


            //////////////////////////////////////
            // Read File                        //
            //////////////////////////////////////

            var reader = new FileReader();

            // File Read Event
            reader.onload = (function(theFile) {
                return function(e) {
                    console.log('File sucessfully read:');
                    console.log(e.target.result);
                };
            })(file);

            // Read in the image file as a data URL.
            reader.readAsText(file);

            //////////////////////////////////////
            // Validation                       //
            //////////////////////////////////////

            // TODO: Validation



            //////////////////////////////////////
            // Update Application State         //
            //////////////////////////////////////

            // TODO: Update Application State: Import Settings and Data

        }, false);

    },
    render: function(){
        "use strict";

        //Pass variables in using Underscore.js Template
        var variables = {
            preset_data: isomatic.options.internal.exampleData
        };

        // Compile the template using underscore
        var template = _.template( $("#import_template").html(), variables );

        // Load the compiled HTML into the Backbone "el"
        this.$el.html(template);
    },
    events: {
        "click #pasteDataSubmit": "submitData"
    }
});
