/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone */

(function(isomatic) {
    "use strict";

    /**
     * isomatic Options Namespace
     * Contains UI Options (Backbone Model)
     * Contains Preset Options (options.preset)
     * Contains Internal Options (options.internal)
     */
    isomatic.options = {};


    ///////////////////////////////////////
    // Internal Options                  //
    ///////////////////////////////////////

    /**
     * Internal Options
     * Those are not acessable via the User-Interface and used for internal computation
     * They should not change within runtime.
     *
     * @type {Object}
     */
    isomatic.options.internal = {

        /**
         * Automatically adjusts scale according to this value
         * Used when recommending a scale
         *
         * @type {Number}
         */
        desiredmaxIconsPerRow: 32,

        /**
         * Icon Size of the SVG Paths in the iconLibrary.js
         *
         * @type {Number}
         */
        defaultIconSize: 32,

        /**
         * Maximum Icon Size
         * Prevents unsane layouts
         *
         * @type {Number}
         */
        maxIconSize: 64,

        /**
         * Default Color if none is chosen yet
         */
        defaultColor: 'CCCCCC',

        /**
         * Default Icon if none is chosen yet
         */
        defaultIcon: 'persons-man',

        /**
         * Array List of available Scales
         *
         * @type {Array}
         */
        scaleArray: [
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
        ],

        /**
         * Available Fontstacks
         */
        availableFonts: {
            'Arial': 'Frutiger, "Frutiger Linotype", Univers, Calibri, "Gill Sans", "Gill Sans MT", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif',
            'Times New Roman': 'Cambria, "Hoefler Text", Utopia, "Liberation Serif", "Nimbus Roman No9 L Regular", Times, "Times New Roman", serif',
            'Georgia': 'Constantia, "Lucida Bright", Lucidabright, "Lucida Serif", Lucida, "DejaVu Serif", "Bitstream Vera Serif", "Liberation Serif", Georgia, serif',
            'Verdana': 'Corbel, "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", "DejaVu Sans", "Bitstream Vera Sans", "Liberation Sans", Verdana, "Verdana Ref", sans-serif'
        },

        /**
         * Height of the Column Legend (Icon and Color Rect)
         *
         * @type {Number}
         */
        columnLegendHeight: 18,

        /**
         * This example Dataset is loaded when the Application loads
         *
         * @type {Array}
         */
        exampleData: [
            {
                "The usage of social networks (in relation to a persons income)":"Facebook",
                "Low Income":"165050000",
                "Medium Income":"395000777",
                "High Income":"135000000"
            },
            {
                "The usage of social networks (in relation to a persons income)":"Twitter",
                "Low Income":"278050000",
                "Medium Income":"198007700",
                "High Income":"88000555"
            },
            {
                "The usage of social networks (in relation to a persons income)":"Google+",
                "Low Income":"459370000",
                "Medium Income":"159200000",
                "High Income":"129000000"
            },
            {
                "The usage of social networks (in relation to a persons income)":"LinkedIn",
                "Low Income":"102500000",
                "Medium Income":"80500770",
                "High Income":"30006000"
            }

        ],

//        exampleData: [
//            {
//                "The usage of social networks (in relation to a persons income)":"Facebook",
//                "Low Income":"165050000",
//                "Medium Income":"395000777",
//                "High Income":"135000000"
//            }
//
//        ],

        /**
         * Color Preset Palettes
         *
         * @type {Object}
         */
        colorPalettes: {
            "Complementary1": [ "333333", "12c4a6", "FF0055", "8c1f43", "237567"],
            "Complementary2": ["333333", "00BDD1", "FF7E00", "D98866", "754552"],
            "Signal1": ["333333","009DE0", "E80073", "FFB103", "BCAA99"],
            "Signal2": ["333333","00AAB5", "C9E000", "ED4200", "AAAAAA"],
            "Rainbow": ["0A7B83","2AA876","FFD265","F19C65","CE4D45"],
            "VioletBlue": ["d437d4", "8c3a8c", "293054", "225ea8", "1d91c0", "41b6c4","7fcdbb"]

        },

        /**
         * Default options for the slimScroll jQuery Plugin
         *
         * @type {Object}
         */
        slimScrollOptions: {
            height: '100%',
            alwaysVisible: true,
            railOpacity: 0.3
        },

        equallyDistributesColumns: true,

        /**
         * Decides if Help is active
         */
        HelpStatus: {
            active: false
        }

    };




    ///////////////////////////////////////
    // Default Options                   //
    ///////////////////////////////////////

    /**
     * isomatic Preset (default) Options
     * @type {Object}
     */
    isomatic.options.preset = {


        /////////////////////////////
        // GRAPH LAYOUTING        //
        /////////////////////////////

        /** Aspect Ratio of the Canvas. Width is always 100% */
        aspectRatio: 16 / 9,

        /** Calculated Width of the Graph */
        graphWidth: 0,

        /** Calculated Height of the Graph */
        graphHeight: 0,

        /** Diagram Type */
        diagramType: 'normal',

        /** Margin to Canvas */
        outerMargin: 20,

        /** Margin between Rows */
        rowMargin: 15,

        /** Margin between Columns TODO: Not implemented */
        columnMargin: 30,

        /** Horizontal Margin between Icons */
        iconHorizontalMargin: -15,

        /** Vertical Margin between Icons */
        iconVerticalMargin: 3,

        /** Break a Row into several Rows visually if number icons exceed this */
        breakRow: false,

        /** Allow RoundUp and RoundDown of the IconSize */
        roundSize: true,

        /** Floor value if Remainder is below */
        roundDown: 0.3,

        /** Ceil value if Remainder is above */
        roundUp: 0.8,

        /** If true, Size of Icons is automatically set to fit width of canvas */
        autoIconSize: true,

        /** Icon Size */
        iconSize: 0,

        /** Auto calculated Icon Size -> This fits the canvas width */
        calculatedIconSize: 0,

        scale: 0,


        /////////////////////////////
        // MAPPING                 //
        /////////////////////////////

        /**
         * Defines if the Color is applied to Rows or Columns
         * Accepts 'row' and 'column'
         * @type {string}
         */
        iconize: 'column',

        /**
         * Defines if the Color is applied to Rows or Columns
         * Accepts 'row' and 'columns'
         * @type {string}
         */
        colorize: 'column',

        /**
         * This stores which row ID maps to which color
         * Defines the default Palette
         */
        colorMap: isomatic.options.internal.colorPalettes.Complementary1,

        /** This stores which column ID maps to which icon */
        iconMap: [
            'persons-man',
            'persons-man',
            'persons-man',
            'persons-man'
        ],


        /////////////////////////////
        // LEGEND                  //
        /////////////////////////////

        legendFont: 'Arial',

        /**
         * Default Font Size for the Legend
         */
        legendFontSize: 12,

        /**
         * Width of Graph Legend (in px)
         *
         * @type {Number}
         */
        legendWidth: 100,

        /**
         * Height / Size of Graphic Title
         */
        legendTitleHeight: 26,

        /**
         * Font Size of the Row Legend
         */
        rowsLegendFontSize: 10,

        /**
         * Decides if Column Legend is drawn or not
         */
        drawColumnLegend: true


    };




    ///////////////////////////////////////
    // Backbone.js Models                //
    ///////////////////////////////////////

    /**
     * UI Options Backbone Model
     * @type {*|void|Object}
     */
    isomatic.options.UiModel = Backbone.Model.extend(  /** @lends UiModel.prototype */ {

        /**
         * @class UiModel
         *
         * @augments Backbone.Model
         * @contructs
         */
        initialize: function () {
            console.log('isomatic.options.Model initialized.');
        },

        /**
         * UI Model Validation
         *
         * @type {Object}
         */
        validation: {

            aspectRatio: {
                required: true,
                pattern: 'number',
                range: [0.5, 2.5]
            },

            graphWidth: {
                required: true,
                range: [0, 1920]
            },

            /** Calculated Height of the Graph */
            graphHeight: {
                required: true,
                range: [0, 1920]
            },

            /** Diagram Type */
            diagramType: {
                required: true,
                oneOf: ['normal', 'versus', 'compare', 'size']
            },

            outerMargin: {
                required: true,
                range: [0, 100]
            },

            rowMargin: {
                required: true,
                pattern: 'number'
            },

            columnMargin: {
                required: true,
                pattern: 'number'
            },

            iconHorizontalMargin: {
                required: true,
                pattern: 'number'
            },

            iconVerticalMargin: {
                required: true,
                pattern: 'number'
            },

            breakRow: {
                required: true,
                oneOf: [true, false]
            },

            scale: {
                required: true,
                pattern: 'number',
                min: 0
            },

            roundDown: {
                required: true,
                range: [0, 1]
            },

            roundUp: {
                required: true,
                range: [0, 1]
            },

            autoIconSize: {
                required: true,
                oneOf: [true, false]
            },

            iconSize: {
                required: true,
                pattern: 'number'
            },

            iconize: {
                required: true,
                oneOf: ['row', 'column']

            },

            colorize: {
                required: true,
                oneOf: ['row', 'column']
            },

            colorMap: {
                required: true
            },

            iconMap: {
                required: true
            },

            legendWidth: {
                required: true,
                range: [0, 500]
            },

            /**
             * Height / Size of Graphic Title
             */
            legendTitleHeight: {
                required: true,
                range: [0, 50]
            },

            /**
             * Font Size of the Row Legend
             */
            rowsLegendFontSize: {
                required: true,
                range: [4, 50]
            },

            /**
             * Decides if Column Legend is drawn or not
             */
            drawColumnLegend: {
                required: true,
                oneOf: [true, false]
            }
        }
    });

    /**
     * UI Options
     * @type {Model}
     */
    isomatic.options.ui = new isomatic.options.UiModel();

    // Fill UI Options with Preset Values
    isomatic.options.ui.set(isomatic.options.preset);


}(isomatic));

