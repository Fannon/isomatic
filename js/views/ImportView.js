/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone, _, Handlebars */

(function(isomatic) {
    "use strict";

    /**
     * Import View
     *
     * @type {*|void|Object}
     */
    isomatic.views.ImportView = Backbone.View.extend({
        initialize: function(){
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

            var source = $('#import-template').html();
            var template = Handlebars.compile(source);
            var html = template();
            this.$el.html(html);

        },
        events: {
            "click #pasteDataSubmit": "submitData"
        }
    });

}(isomatic));

