/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone */

/** Data Namespace */
isomatic.data = {};

/**
 * Backbone Model
 * @type {*|void|Object}
 */
isomatic.data.Model = Backbone.Model.extend({

    // On Init
    initialize: function() {
        "use strict";
        console.log('isomatic.data.Model initialized.');
    },

    defaults: {
        data: {}
    }

});

/**
 * Raw Data Model
 * @type {isomatic.data.Model}
 */
isomatic.data.raw = new isomatic.data.Model();

/**
 * Meta Data Model
 * @type {isomatic.data.Model}
 */
isomatic.data.meta = new isomatic.data.Model({

    /** Minimum Value in Data */
    min: 0,
    /** Maximum Value in Data */
    max: 0,
    /** Sum of all Values in Data */
    sum: 0,
    /** Array of all Rows. Can be used to get the readable name of an Row ID */
    rows: [],
    /** Array of all Columns. Can be used to get the readable name of an Column ID */
    columns: []

});

/**
 * Processed Data Model
 * @type {isomatic.data.Model}
 */
isomatic.data.processed = new isomatic.data.Model();

