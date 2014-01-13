/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone */

/**
 * isomatic Options Namespace
 */
isomatic.options = {};


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
isomatic.options.preset.iconSize = 'auto';

/**
 * Defines if the Color is applied to Rows or Columns
 * Accepts 'row' and 'column'
 * @type {string}
 */
isomatic.options.preset.iconize = 'column';

/**
 * Defines if the Color is applied to Rows or Columns
 * Accepts 'row' and 'column'
 * @type {string}
 */
isomatic.options.preset.colorize = 'column';

/** This stores which row ID maps to which color */
isomatic.options.preset.colorMap = ["#0B486B", "#3B8686", "#79BD9A", "#A8DBA8", "#CFF09E"];

/** This stores which column ID maps to which icon */
isomatic.options.preset.iconMap = [
    {category: 'socialNetworks', name: 'facebook'},
    {category: 'socialNetworks', name: 'twitter'},
    {category: 'socialNetworks', name: 'googleplus'},
    {category: 'socialNetworks', name: 'linkedin'}
];


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
    "Blue": ["#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494"],
    "Red": ["#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026"],
    "Greyscale": ["#bdbdbd","#969696","#737373","#525252","#252525"],
    "Colorful": [ "#787679", "#F80E27","#F8981F","#87D84D","#0D9FD8"],
    "Rainbow": ["#0A7B83","#2AA876","#FFD265","#F19C65","#CE4D45"],
    "Paired": ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a"]

};

///////////////////////////////////////
// Backbone.js Models                //
///////////////////////////////////////

/**
 * Backbone Model
 * @type {*|void|Object}
 */
isomatic.options.Model = Backbone.Model.extend({

    // On Init
    initialize: function (options) {
        "use strict";
        console.log('isomatic.options.Model initialized.');
    },

    // Model Validation
    // TODO: Validation of Options.
    // TODO: UI should validate Settings before writing them
    // TODO: Display Validation Errors on UI
    validate: function(attrs, options){
        "use strict";

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

