/* jshint jquery:true, devel: true */
/* global isomatic, d3 */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

/**
 * isomatic current options
 *
 * TODO: Convert this into a backbone.js model
 */
isomatic.options = {};


///////////////////////////////////////
// UI Default Options                //
///////////////////////////////////////

// GENERAL LAYOUTING
isomatic.options.aspectRatio = 16 / 5;
isomatic.options.outerPadding = 10;
isomatic.options.rowPadding = 10;

// CALCULATION SETTINGS
isomatic.options.roundDown = 0.3;
isomatic.options.roundUp = 0.8;

// ICON SETTINGS
/** This stores which column ID maps to which icon */
isomatic.options.iconMap = [
    {category: 'socialNetworks', name: 'facebook'},
    {category: 'socialNetworks', name: 'twitter'},
    {category: 'socialNetworks', name: 'googleplus'},
    {category: 'socialNetworks', name: 'linkedin'}
];

/**
 * Defines if the Color is applied to Rows or Columns
 * Accepts 'row' and 'column'
 * @type {string}
 */
isomatic.options.iconize = 'row';

isomatic.options.iconHorizontalPadding = 3;
isomatic.options.iconVerticalPadding = 30;


// COLOR SETTINGS
/** This stores which row ID maps to which color */
isomatic.options.colorMap = ["#0B486B", "#3B8686", "#79BD9A", "#A8DBA8", "#CFF09E"];

/**
 * Defines if the Color is applied to Rows or Columns
 * Accepts 'row' and 'column'
 * @type {string}
 */
isomatic.options.colorize = 'column';



///////////////////////////////////////
// Internal Options                  //
///////////////////////////////////////

isomatic.options.desiredTotalIcons = 64;
isomatic.options.defaultIconSize = 32;
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



