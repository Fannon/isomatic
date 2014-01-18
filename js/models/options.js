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

        /** Automatically adjusts scale according to this value */
        desiredTotalIcons: 64,

        /** Automatically adjusts scale according to this value */
        desiredmaxIconsPerRow: 16,

        /** Icon Size of the SVG Paths in defaultIcons.js */
        defaultIconSize: 32,

        /** Array List of available Scales */
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

        fontsArray: [
            'Arial',
            'Times New Roman',
            'Georgia',
            'Calibri'
        ],

        columnLegendHeight: 18,

        /** This example Dataset is loaded when the Application loads */
        exampleData: [
            {
                "Example Dataset":"Facebook",
                "<30.000/year":"165050000",
                "30.000-50.000":"395000777",
                ">50.000":"135000000"
            },
            {
                "Example Dataset":"Twitter",
                "<30.000/year":"278050000",
                "30.000-50.000":"198007700",
                ">50.000":"88000555"
            },
            {
                "Example Dataset":"Google+",
                "<30.000/year":"459370000",
                "30.000-50.000":"159200000",
                ">50.000":"129000000"
            },
            {
                "Example Dataset":"LinkedIn",
                "<30.000/year":"102500000",
                "30.000-50.000":"80500770",
                ">50.000":"30006000"
            }
        ],

        /**
         * Color Preset Palettes
         * http://bl.ocks.org/mbostock/5577023
         */
        colorPalettes: {
            "Signal1": ["333333","009DE0", "E80073", "FFB103", "BCAA99"],
            "Signal2": ["333333","00AAB5", "C9E000", "ED4200", "AAAAAA"],
            "Complementary1": ["034f57", "00BDD1", "FF7E00", "D98866", "754552"],
            "Complementary2": [ "333333", "12c4a6", "FF0055", "8c1f43", "237567"],
            "Rainbow": ["0A7B83","2AA876","FFD265","F19C65","CE4D45"],
            "Military": ["494726", "968651","D6BE45","A52421","D34F4F"],
            "Blue": ["293054", "225ea8", "1d91c0", "41b6c4","7fcdbb"],
            "Red": ["74104B", "A7264D", "BE3550", "F36244","FAA143"]
        },

        slimmScrollOptions: {
            height: '100%',
            alwaysVisible: true,
            railOpacity: 0.3
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
        rowMargin: 30,

        /** Margin between Columns TODO: Not implemented */
        columnMargin: 30,

        /** Horizontal Margin between Icons */
        iconHorizontalMargin: 3,

        /** Vertical Margin between Icons */
        iconVerticalMargin: 3,

        /** Break a Row into several Rows visually if number icons exceed this */
        breakRow: false,

        /** Floor value if Remainder is below */
        roundDown: 0.3,

        /** Ceil value if Remainder is above */
        roundUp: 0.8,

        /** Icon Size */
        iconSize: 0,


        /////////////////////////////
        // MAPPING                 //
        /////////////////////////////

        /**
         * Defines if the Color is applied to Rows or Columns
         * Accepts 'row' and 'column'
         * @type {string}
         */
        iconize: 'row',

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
            {category: 'socialNetworks', name: 'facebook'},
            {category: 'socialNetworks', name: 'twitter'},
            {category: 'socialNetworks', name: 'googleplus'},
            {category: 'socialNetworks', name: 'linkedin'}
        ],


        /////////////////////////////
        // LEGEND                  //
        /////////////////////////////

        /**
         * Default Font Size for the Legend
         */
        legendFontSize: 12,

        /**
         * Width of Graph Legend (in px)
         *
         * @type {Number}
         */
        legendWidth: 120,

        /**
         * Height / Size of Graphic Title
         */
        legendTitleHeight: 24,

        /**
         * Font Size of the Row Legend
         */
        rowsLegendFontSize: 14,

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
                range: [0.5, 5]
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

            roundDown: {
                required: true,
                range: [0, 1]
            },

            roundUp: {
                required: true,
                range: [0, 1]
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

