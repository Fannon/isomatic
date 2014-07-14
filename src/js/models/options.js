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
                "Usage of free reshipment (percentage of 1.000 respondents)":"Nearly Always",
                "Female":"3",
                "Male":"2"
            },
            {
                "Usage of free reshipment (percentage of 1.000 respondents)":"In Most Cases",
                "Female":"11",
                "Male":"8"
            },
            {
                "Usage of free reshipment (percentage of 1.000 respondents)":"Frequently",
                "Female":"31",
                "Male":"22"
            },
            {
                "Usage of free reshipment (percentage of 1.000 respondents)":"Rarely",
                "Female":"51",
                "Male":"58"
            },
            {
                "Usage of free reshipment (percentage of 1.000 respondents)":"Never Before",
                "Female":"2",
                "Male":"6"
            },
            {
                "Usage of free reshipment (percentage of 1.000 respondents)":"No Online Purchases",
                "Female":"2",
                "Male":"5"
            }

        ],

        /**
         * Color Preset Palettes
         *
         * @type {Object}
         */
        colorPalettes: {
            "Signal": ["333333","00AAB5", "C9E000", "ED4200", "FF8400", "B516B5"],
            "Rainbow": ["0A7B83","2AA876","FFD265","F19C65","CE4D45", "7D4DAB"],
            "VioletBlue": ["d437d4", "8c3a8c", "293054", "225ea8", "1d91c0", "41b6c4","7fcdbb"],
            "ColorBrewerSet1": ["e41a1c","377eb8","4daf4a","984ea3","ff7f00","ffff33","a65628","f781bf","999999"],
            "ColorBrewerPaired": ["b15928", "ffff99", "6a3d9a", "cab2d6", "ff7f00", "fdbf6f", "e31a1c", "fb9a99", "33a02c", "b2df8a", "1f78b4", "a6cee3"],
            "ColorBrewerPastel": ["fbb4ae","b3cde3","ccebc5","decbe4","fed9a6","ffffcc","e5d8bd","fddaec","f2f2f2"],
            "ColorBrewerBlues": ["08306b", "08519c", "2171b5", "4292c6", "6baed6", "9ecae1", "c6dbef", "deebf7", "f7fbff"] ,
            "ColorBrewerYIGnBu": ["081d58", "253494", "225ea8", "1d91c0", "41b6c4", "7fcdbb", "c7e9b4", "edf8b1", "ffffd9"],
            "ColorBrewerYIGn": ["004529", "006837", "238443", "41ab5d", "78c679", "addd8e", "d9f0a3", "f7fcb9", "ffffe5"],
            "ColorBrewerRdPu": ["49006a", "7a0177", "ae017e", "dd3497", "f768a1", "fa9fb5", "fcc5c0", "fde0dd", "fff7f3"],
            "ColorBrewerRdBu": ["053061", "2166ac", "4393c3", "92c5de", "d1e5f0", "f7f7f7", "fddbc7", "f4a582", "d6604d", "b2182b", "67001f"]
        },

        /**
         * Default options for the slimScroll jQuery Plugin
         *
         * @type {Object}
         */
        slimScrollOptions: {
            height: '100%',
            alwaysVisible: true,
            railVisible: true,
            color: '#555',
            railColor: '#CCC',
            railOpacity: 1
        },

        /**
         * Decides if Help is active
         */
        HelpStatus: {
            active: false,
            location: 'home'
        },

        debugGrid: false

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
        // LAYOUTING               //
        /////////////////////////////

        /** Aspect Ratio of the Canvas. Width is always 100% */
        aspectRatio: 16 / 9,

        /** Calculated Width of the Graph */
        graphWidth: 0,

        /** Calculated Height of the Graph */
        graphHeight: 0,

        /** Diagram Type */
        diagramType: 'versus',

        /** Margin to Canvas */
        outerMargin: 20,

        /** Margin between Rows */
        rowMargin: 20,

        /** Margin between Columns */
        columnMargin: 5,

        /** Horizontal Margin between Icons */
        iconHorizontalMargin: 5,

        /** Vertical Margin between Icons */
        iconVerticalMargin: 5,

        /** Equally distribute the width of the Columns */
        equallyDistributedColumns: true,

        /** Break a Row into several Rows visually if number icons exceed this */
        breakRow: false,

        /** Allow RoundUp and RoundDown of the IconSize */
        roundSize: false,

        /** Floor value if Remainder is below */
        roundDown: 0.3,

        /** Ceil value if Remainder is above */
        roundUp: 0.8,

        /** If true, Size of Icons is automatically set to fit width of canvas */
        autoIconSize: false,

        /** Icon Size */
        iconSize: 35,

        /** Auto calculated Icon Size -> This fits the canvas width */
        calculatedIconSize: 0,

        /**
         * Icon Scale Factor
         */
        scale: 3,


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
        colorize: 'row',

        /**
         * This stores which row ID maps to which color
         * Defines the default Palette
         */
        colorMap: ["333333","00AAB5", "C9E000", "ED4200", "FFB812", "AAAAAA"],

        /** This stores which column ID maps to which icon */
        iconMap: [
            'persons-man1',
            'persons-man2',
            'persons-man2',
            'persons-man2',
            'persons-man2',
            'persons-man2',
            'persons-man2',
            'persons-man2'
        ],


        /////////////////////////////
        // LEGEND                  //
        /////////////////////////////

        /**
         * Legend Font Family
         */
        legendFont: 'Georgia',

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
        leftLegendFontSize: 14,

        /**
         * Font Size of the Column Legend
         */
        bottomLegendFontSize: 12,

        /**
         * Decides if Column Legend is drawn or not
         */
        drawColumnLegend: true,

        /**
         * Draws Lines between the Icon-Group Blocks
         */
        drawLines: true,

        drawVerticalLines: true,

        drawHorizontalLines: false,

        lineColor: 'CCCCCC'

    };

    isomatic.options.examples = {
        "FreeShipment": {
            "title": "Usage of free shipment",
            "data": {
                "data": isomatic.options.internal.exampleData,
                "pastedData": ""
            },
            "options":isomatic.options.preset
        },
        "SocialMedia": {
            "title": "Social Media Usage",
            "data": {"data":[{"Social Media Users":"Facebook","Users":"901000000"},{"Social Media Users":"Twitter","Users":"555000000"},{"Social Media Users":"Google+","Users":"170000000"},{"Social Media Users":"LinkedIn","Users":"150000000"},{"Social Media Users":"Pinterest","Users":"11700000"}],"pastedData":""},
            "options": {"aspectRatio": 1.7777777777777777, "graphWidth": 960, "graphHeight": 540, "diagramType": "normal", "outerMargin": "20", "rowMargin": "20", "columnMargin": 0, "iconHorizontalMargin": "5", "iconVerticalMargin": 0, "equallyDistributedColumns": true, "breakRow": false, "roundSize": false, "roundDown": "0.3", "roundUp": "0.8", "autoIconSize": true, "iconSize": 40.556, "calculatedIconSize": 40.556, "scale": "50000000", "iconize": "row", "colorize": "row", "colorMap": ["054995", "64C6EE", "DD4C39", "0479AD"], "iconMap": ["social_networks-facebook", "social_networks-twitter", "social_networks-googleplus", "social_networks-linkedin", "social_networks-pinterest"], "legendFont": "Frutiger, \"Frutiger Linotype\", Univers, Calibri, \"Gill Sans\", \"Gill Sans MT\", \"Myriad Pro\", Myriad, \"DejaVu Sans Condensed\", \"Liberation Sans\", \"Nimbus Sans L\", Tahoma, Geneva, \"Helvetica Neue\", Helvetica, Arial, sans-serif", "legendFontSize": 12, "legendWidth": "100", "legendTitleHeight": "32", "leftLegendFontSize": "14", "bottomLegendFontSize": "12", "drawColumnLegend": true, "drawLines": true, "drawVerticalLines": true, "drawHorizontalLines": false, "lineColor": "CCCCCC"}
        },
        "FamilyIncomes": {
            "title": "Family Incomes",
            "data": {"data":[{"Family incomes in percent":"Couples","less than 1.300":"3","1.300 - 2.600":"31","2.600 - 4.500":"46","4.500 or more":"19"},{"Family incomes in percent":"Life partnerships","less than 1.300":"7","1.300 - 2.600":"42","2.600 - 4.500":"39","4.500 or more":"11"},{"Family incomes in percent":"Single Mothers","less than 1.300":"44","1.300 - 2.600":"48","2.600 - 4.500":"8","4.500 or more":"1"},{"Family incomes in percent":"Single Fathers","less than 1.300":"24","1.300 - 2.600":"50","2.600 - 4.500":"20","4.500 or more":"5"}],"pastedData":""},
            "options": {"aspectRatio":1.7777777777777777,"graphWidth":960,"graphHeight":540,"diagramType":"compare","outerMargin":"20","rowMargin":"20","columnMargin":"5","iconHorizontalMargin":"-16","iconVerticalMargin":"5","equallyDistributedColumns":true,"breakRow":false,"roundSize":false,"roundDown":0.3,"roundUp":0.8,"autoIconSize":true,"iconSize":32,"calculatedIconSize":32,"scale":2,"iconize":"row","colorize":"column","colorMap":["333333","00AAB5","C9E000","ED4200"],"iconMap":["persons-man","persons-man","persons-man","persons-man"],"legendFont":"Frutiger, \"Frutiger Linotype\", Univers, Calibri, \"Gill Sans\", \"Gill Sans MT\", \"Myriad Pro\", Myriad, \"DejaVu Sans Condensed\", \"Liberation Sans\", \"Nimbus Sans L\", Tahoma, Geneva, \"Helvetica Neue\", Helvetica, Arial, sans-serif","legendFontSize":12,"legendWidth":"120","legendTitleHeight":"26","leftLegendFontSize":"14","bottomLegendFontSize":"12","drawColumnLegend":true,"drawLines":true,"drawVerticalLines":false,"drawHorizontalLines":false,"lineColor":"CCCCCC"}
        }
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
//            console.log('isomatic.options.Model initialized.');
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

