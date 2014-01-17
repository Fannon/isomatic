/* jshint jquery:true, devel: true */
/* global d3, Backbone, _, Handlebars */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

///////////////////////////////////////
// Global Variables                  //
///////////////////////////////////////

/** Global namespace */
var isomatic = {};

(function(isomatic) {
    "use strict";

    /** Views namespace */
    isomatic.views = {};


    ///////////////////////////////////////
    // On DOM Ready                      //
    ///////////////////////////////////////

    $(function() {


        ///////////////////////////////////////
        // Init Application                  //
        ///////////////////////////////////////

        // Init Views
        var views = isomatic.views;

        views.graphView      = new views.GraphView({el: $("#graph-container")});

        views.newView        = new views.NewView({el: $("#new-modal")});
        views.importView     = new views.ImportView({el: $("#import-modal")});
        views.exportView     = new views.ExportView({el: $("#export-modal")});
        views.helpView       = new views.HelpView({el: $("#help-modal")});

        views.dataView       = new views.DataView({el: $("#data-container")});
        views.typeView       = new views.TypeView({el: $("#type-container")});
        views.iconView       = new views.IconView({el: $("#icon-container")});
        views.colorView      = new views.ColorView({el: $("#color-container")});
        views.propertiesView = new views.AdjustmentsView({el: $("#adjustments-container")});
        views.scaleView      = new views.ScaleView({el: $("#scale-container")});
        views.textView       = new views.TextView({el: $("#text-container")});

        // Draw Example Data Set
        isomatic.refreshData();


        ///////////////////////////////////////
        // Init 3rd Party Plugins            //
        ///////////////////////////////////////

        // Init Foundation JavaScript
        $(document).foundation();

        // Register ugly Hack
        $('.trigger-ui').on('click', function(el) {
            isomatic.uglyHack(el.currentTarget);
        });

    });


    ///////////////////////////////////////
    // Backbone.Validation Config        //
    ///////////////////////////////////////

    // Register Backbone Model Validation
    _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

    // Register Callback Function on Validation Error
    // This manipulates the View DOM Items to indicate Validation Errors
    _.extend(Backbone.Validation.callbacks, {
        invalid: function(view, attr, error, selector) {
            console.info('Validated:Invalid: ' + attr);
            $('input[name=' + attr + ']').addClass('invalid has-tip tip-right').attr('title', error).attr('data-tooltip', true);
        }
    });


    ///////////////////////////////////////
    // General Helper Functions          //
    ///////////////////////////////////////

    /**
     * Refreshes the Data and completely redraws the Graphic
     */
    isomatic.refreshData = function() {

        isomatic.views.dataView.analyze();


        // Refresh Layout
        isomatic.refreshLayout();

    };

    /**
     * Refreshes the Layout and the Design
     */
    isomatic.refreshLayout = function() {

        // Creates a new Visualsation
        isomatic.views.graphView.newVisualisation();

        // Calculates the layouted Data
        isomatic.views.graphView.layout();

        // Precalculate Layout and save it into the Metadata Object.
        isomatic.views.graphView.precalculate();


        // Refresh Design, too
        isomatic.refreshDesign();

    };

    /**
     * Redraws just the Design
     */
    isomatic.refreshDesign = function() {

        // Prepare Drawing
        isomatic.views.graphView.prepareDrawing();

        // Draw Isotype Graphic
        isomatic.views.graphView.drawIsotype();

        // Draw Legend Overlay
        isomatic.views.graphView.drawLegend();

    };

    /**
     * Helper Function to register the Colorpicker with global default options
     * @param el
     */
    isomatic.registerColorpicker = function(el) {

        el.colpick({
            color: el[0].value,
            layout:'rgbhex',
            submit:0,
            colorScheme:'dark',
            onChange:function(hsb,hex,rgb,fromSetColor) {
                if(!fromSetColor) {
                    el.val(hex).css('border-color','#'+hex);
                }
            }
        });

        el[0].style.borderColor = '#' + el[0].value;

    };

    /**
     * Returns a YYYY-MM-DD_-_HH-MM-SS formatted DateString
     * @return {String} formatted Date String
     */
    isomatic.getFormattedTime = function() {

        console.log('isomatic.getFormattedTime();');

        var a     = new Date();

        var year  = a.getFullYear();
        var month = isomatic.pad(a.getMonth() + 1);
        var date  = isomatic.pad(a.getDate());
        var hour  = isomatic.pad(a.getHours());
        var min   = isomatic.pad(a.getMinutes());
        var sec   = isomatic.pad(a.getSeconds());

        return year + '-' + month + '-' + date + '_-_' + hour + ':' + min + ':' + sec;
    };

    /**
     * Pads a Number
     * @param n             Number to Pad
     * @returns {string}    Padded Number
     */
    isomatic.pad = function(n) {
        return n < 10 ? '0' + n : n;
    };

    /**
     * If Toolbar Button is clicked when the target Overlay is alredy open: Close the Overlay instead
     *
     * @param el
     */
    isomatic.uglyHack = function(el) {
        var id = el.id.split('-')[1];
        if (window.location.hash === '#' + id) {
            setTimeout(function() {
                window.location = '#home';
            }, 50);
        }
    };


    ///////////////////////////////////////
    // 3rd Party Scripts                 //
    ///////////////////////////////////////

    /**
     * jQuery Plugin to allow File Downloads from JavaScript Variables
     * http://tutorialzine.com/2011/05/generating-files-javascript-php/
     */
    (function($) {

        // Creating a jQuery plugin:
        $.generateFile = function(options) {

            options = options || {};

            if (!options.script || !options.filename || !options.content) {
                throw new Error("Please enter all the required config options!");
            }

            // Creating a 1 by 1 px invisible iframe:

            var iframe = $('<iframe>', {
                width: 1,
                height: 1,
                frameborder: 0,
                css: {
                    display: 'none'
                }
            }).appendTo('body');

            var formHTML = '<form action="" method="post">' +
                '<input type="hidden" name="filename" />' +
                '<input type="hidden" name="content" />' +
                '</form>';

            // Giving IE a chance to build the DOM in
            // the iframe with a short timeout:

            setTimeout(function() {

                // The body element of the iframe document:

                var body = (iframe.prop('contentDocument') !== undefined) ?
                    iframe.prop('contentDocument').body :
                    iframe.prop('document').body;	// IE

                body = $(body);

                // Adding the form to the body:
                body.html(formHTML);

                var form = body.find('form');

                form.attr('action', options.script);
                form.find('input[name=filename]').val(options.filename);
                form.find('input[name=content]').val(options.content);

                // Submitting the form to download.php. This will
                // cause the file download dialog box to appear.

                form.submit();
            }, 50);
        };

    })(jQuery);

}(isomatic));

