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
        },
        render: function(){

            var source = $('#import-template').html();
            var template = Handlebars.compile(source);
            var html = template();
            this.$el.html(html);

        },
        events: {
            "change #imported-file": "importData"
        },

        importData: function(event) {

            var self = this;
            var file = event.target.files[0];


            //////////////////////////////////////
            // Read File                        //
            //////////////////////////////////////

            var reader = new FileReader();

            // File Read Event
            reader.onload = (function(theFile) {
                return function(e) {

                    console.log('File sucessfully read:');
                    console.log('Filetype: ' + file.type);

                    // Check if SVG or JSON
                    if (file.type === 'image/svg+xml') {
                        self.importSvg(file, e.target.result);
                    } else {
                        self.importJson(file, e.target.result);
                    }

                };
            })(file);

            // Read the File as Text Format
            // This triggers the reader.onload Event when done reading
            reader.readAsText(file);

        },

        importSvg: function(file, result) {

            console.log('ImportView.importSvg()');

            try {
                var importHtml = $(result).find('#isomatic-metadata').html();

                var importObject = JSON.parse(importHtml);

                this.updateApplicationState(importObject);

            } catch(error) {
                this.printErrorMessage('Imported Data is corrupt or in the wrong format!');
            }
        },

        importJson: function(file, result) {

            console.log('ImportView.importJson()');

            try {
                var importObject = JSON.parse(result);
                console.dir(importObject);
                this.updateApplicationState(importObject);

            } catch(error) {
                this.printErrorMessage('Imported Data is corrupt or in the wrong format!');
            }

        },

        updateApplicationState: function(importObject) {

            var success = true;

            console.log('ImportView.updateApplicationState()');
            console.dir(importObject);

            // Check for Data, validate and import it
            if (importObject.data && importObject.data !== '') {

                var data = importObject.data;

                var dataErrors = isomatic.data.raw.validate(data);

                if (!dataErrors) {
                    isomatic.data.raw.set(data);
                } else {
                    this.printErrorMessage('Imported Options not valid! <br>(Detailed Error Report is in the Dev Console)');
                    console.dir(dataErrors);
                    success = false;
                }

            } else {

                this.printErrorMessage('No Data provided!');
                success = false;
            }

            if (importObject.options && importObject.options !== '') {

                var options = importObject.options;

                var optionsErrors = isomatic.options.ui.validate(options);

                if (!optionsErrors) {
                    isomatic.options.ui.set(options);
                } else {
                    this.printErrorMessage('Imported Options not valid! <br>(Detailed Error Report is in the Dev Console)');
                    console.dir(optionsErrors);
                    success = false;
                }

            } else {
                this.printErrorMessage('No Options provided!');
                success = false;
            }

            if (success) {
                isomatic.refreshData();
                this.success();
            }
        },

        printErrorMessage: function(msg) {
            $('#import-errors').show().delay(4000).fadeOut(400);
            $('#import-errors div').html(msg);
        },

        success: function() {
            $('#import-success').show().show().delay(1500).fadeOut(400);
        }

    });

}(isomatic));

