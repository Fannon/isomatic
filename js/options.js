/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

/**
 * isomatic Options Namespace
 *
 * TODO: Convert this into a backbone.js model
 * TODO: Seperate UI Options from internal Options (For clean Export)
 */
isomatic.options = {};



///////////////////////////////////////
// Default Options                   //
///////////////////////////////////////

/**
 * isomatic Preset Options
 * @type {{}}
 */
isomatic.options.preset = {};

/** Aspect Ratio of the Canvas. Width is always 100% */
isomatic.options.preset.aspectRatio = 16 / 8;

/** Margin to Canvas */
isomatic.options.preset.outerMargin = 10;



///////////////////////////////////////
// Backbone.js Models                //
///////////////////////////////////////


/**
 * Backbone Model
 * @type {*|void|Object}
 */
isomatic.options.Model = Backbone.Model.extend({
    initialize: function (options) {
        "use strict";
        console.log('isomatic.options.Model initialized.');
    }
});

/**
 * UI Options
 * @type {Model}
 */
isomatic.options.ui = new isomatic.options.Model();

// Set Default Options
isomatic.options.ui.set(isomatic.options.preset);

console.dir(isomatic.options.ui.toJSON());



///////////////////////////////////////
// UI Default Options                //
///////////////////////////////////////

// GENERAL LAYOUTING
/** Aspect Ratio of the Canvas. Width is always 100% */
isomatic.options.aspectRatio = 16 / 8;

/** Margin to Canvas */
isomatic.options.outerMargin = 10;

/** Margin between Rows */
isomatic.options.rowMargin = 30;

/** Margin between Columns TODO: Not implemented */
isomatic.options.columnMargin = 30;

/** Horizontal Margin between Icons */
isomatic.options.iconHorizontalMargin = 3;

/** Vertical Margin between Icons */
isomatic.options.iconVerticalMargin = 3;

/** Break a Row into several Rows visually if number icons exceed this */
isomatic.options.breakRow = 0;


// CALCULATION SETTINGS
isomatic.options.roundDown = 0.3;
isomatic.options.roundUp = 0.8;


// ICON AND COLOR MAPPING

/**
 * Defines if the Color is applied to Rows or Columns
 * Accepts 'row' and 'column'
 * @type {string}
 */
isomatic.options.iconize = 'column';

/**
 * Defines if the Color is applied to Rows or Columns
 * Accepts 'row' and 'column'
 * @type {string}
 */
isomatic.options.colorize = 'column';

/** This stores which row ID maps to which color */
isomatic.options.colorMap = ["#0B486B", "#3B8686", "#79BD9A", "#A8DBA8", "#CFF09E"];

/** This stores which column ID maps to which icon */
isomatic.options.iconMap = [
    {category: 'socialNetworks', name: 'facebook'},
    {category: 'socialNetworks', name: 'twitter'},
    {category: 'socialNetworks', name: 'googleplus'},
    {category: 'socialNetworks', name: 'linkedin'}
];


///////////////////////////////////////
// Internal Options                  //
///////////////////////////////////////

/** Automatically adjusts scale according to this value */
isomatic.options.desiredTotalIcons = 64;

/** Automatically adjusts scale according to this value */
isomatic.options.desiredmaxIconsPerRow = 16;

/** Icon Size of the SVG Paths in defaultIcons.js */
isomatic.options.defaultIconSize = 32;

/** Array List of available Scales */
isomatic.options.scaleArray = [
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



