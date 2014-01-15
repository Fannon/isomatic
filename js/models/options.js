/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone */




///////////////////////////////////////
// Internal Options                  //
///////////////////////////////////////

(function(isomatic) {
    "use strict";

    /**
     * isomatic Options Namespace
     */
    isomatic.options = {};

    /**
     * Internal Options
     * Those are not acessable via the User-Interface and used for internal computation
     * They should not change within runtime.
     *
     * @type {Object}
     */
    isomatic.options.internal = {};

    /** Automatically adjusts scale according to this value */
    isomatic.options.internal.desiredTotalIcons = 64;

    /** Automatically adjusts scale according to this value */
    isomatic.options.internal.desiredmaxIconsPerRow = 16;

    /** Icon Size of the SVG Paths in defaultIcons.js */
    isomatic.options.internal.defaultIconSize = 32;

    /** Array List of available Scales */
    isomatic.options.internal.scaleArray = [
        1, 2, 5,
        10, 20, 50,
        100, 200, 500,
        1000, 2000, 5000,
        10000, 20000, 50000,
        100000, 200000, 500000,
        1000000, 2000000, 5000000,
        10000000, 20000000, 50000000,
        100000000, 200000000, 500000000,
        1000000000, 2000000000, 5000000000,
        10000000000, 20000000000, 50000000000,
        100000000000, 200000000000, 500000000000,
        1000000000000, 2000000000000, 5000000000000
    ];

    /** This example Dataset is loaded when the Application loads */
    isomatic.options.internal.exampleData = "\t<30.000/year\t30.000-50.000\t>50.000\nFacebook\t165050000\t395000777\t135000000\nTwitter\t278050000\t198007700\t88000555\nGoogle+\t459370000\t159200000\t129000000\nLinkedIn\t102500000\t80500770\t30006000";

    /**
     * Color Preset Palettes
     * http://bl.ocks.org/mbostock/5577023
     */
    isomatic.options.internal.colorPalettes = {
        "Signal1": ["333333","009DE0", "E80073", "FFB103", "BCAA99"],
        "Signal2": ["333333","00AAB5", "C9E000", "ED4200", "AAAAAA"],
        "Complementary1": ["034f57", "00BDD1", "FF7E00", "D98866", "754552"],
        "Complementary2": [ "333333", "12c4a6", "FF0055", "8c1f43", "237567"],
        "Rainbow": ["0A7B83","2AA876","FFD265","F19C65","CE4D45"],
        "Military": ["494726", "968651","D6BE45","A52421","D34F4F"],
        "Blue": ["293054", "225ea8", "1d91c0", "41b6c4","7fcdbb"],
        "Red": ["74104B", "A7264D", "BE3550", "F36244","FAA143"]


    };

    isomatic.options.internal.slimmScrollOptions = {
        height: '100%',
        alwaysVisible: true,
        railOpacity: 0.3
    };


    ///////////////////////////////////////
    // Default Options                   //
    ///////////////////////////////////////

    /**
     * isomatic Preset (default) Options
     * @type {Object}
     */
    isomatic.options.preset = {};

    // GENERAL LAYOUTING
    /** Aspect Ratio of the Canvas. Width is always 100% */
    isomatic.options.preset.aspectRatio = 16 / 9;

    /** Diagram Type */
    isomatic.options.preset.diagramType = 'normal';

    /** Margin to Canvas */
    isomatic.options.preset.outerMargin = 10;

    /** Margin between Rows */
    isomatic.options.preset.rowMargin = 30;

    /** Margin between Columns TODO: Not implemented */
    isomatic.options.preset.columnMargin = 30;

    /** Horizontal Margin between Icons */
    isomatic.options.preset.iconHorizontalMargin = 3;

    /** Vertical Margin between Icons */
    isomatic.options.preset.iconVerticalMargin = 3;

    /** Break a Row into several Rows visually if number icons exceed this */
    isomatic.options.preset.breakRow = 0;

    /** Floor value if Remainder is below */
    isomatic.options.preset.roundDown = 0.3;

    /** Ceil value if Remainder is above */
    isomatic.options.preset.roundUp = 0.8;

    /** Icon Size */
    isomatic.options.preset.iconSize = '';

    /**
     * Defines if the Color is applied to Rows or Columns
     * Accepts 'row' and 'column'
     * @type {string}
     */
    isomatic.options.preset.iconize = 'row';

    /**
     * Defines if the Color is applied to Rows or Columns
     * Accepts 'row' and 'columns'
     * @type {string}
     */
    isomatic.options.preset.colorize = 'column';

    /**
     * This stores which row ID maps to which color
     * Defines the default Palette
     */
    isomatic.options.preset.colorMap = isomatic.options.internal.colorPalettes.Complementary1;

    /** This stores which column ID maps to which icon */
    isomatic.options.preset.iconMap = [
        {category: 'socialNetworks', name: 'facebook'},
        {category: 'socialNetworks', name: 'twitter'},
        {category: 'socialNetworks', name: 'googleplus'},
        {category: 'socialNetworks', name: 'linkedin'}
    ];


    ///////////////////////////////////////
    // Backbone.js Models                //
    ///////////////////////////////////////

    /**
     * Backbone Model
     * @type {*|void|Object}
     */
    isomatic.options.Model = Backbone.Model.extend({

        // On Init
        initialize: function () {
            console.log('isomatic.options.Model initialized.');
        },

        // Model Validation
        // TODO: Validation of Options.
        // TODO: UI should validate Settings before writing them
        // TODO: Display Validation Errors on UI
        validate: function(attrs, options){

            if (attrs.outerMargin < 0){
                return "Margin Value has to be positive!";
            }
            return true;
        }
    });

    /**
     * UI Options
     * @type {Model}
     */
    isomatic.options.ui = new isomatic.options.Model();

    // Set Default Options
    isomatic.options.ui.set(isomatic.options.preset);


}(isomatic));

