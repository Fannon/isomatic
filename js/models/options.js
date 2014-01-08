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
isomatic.options.preset.aspectRatio = 16 / 8;

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
isomatic.options.internal.exampleData = [
    {"":"Facebook","<30.000/year":"265050000","30.000-50.000":"395000777",">50.000":"135000000"},
    {"":"Twitter","<30.000/year":"178050000","30.000-50.000":"198007700",">50.000":"88000555"},
    {"":"Google+","<30.000/year":"159370000","30.000-50.000":"159200000",">50.000":"129000000"},
    {"":"LinkedIn","<30.000/year":"102500000","30.000-50.000":"80500770",">50.000":"30006000"}
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

