/* jshint jquery:true, devel: true */
/* global isomatic, d3, Backbone */

(function(isomatic) {
    "use strict";

    /**
     * Data Namespace
     * Contains 3 Data Models: Raw, Meta and Processed Data.
     */
    isomatic.data = {};

    /**
     * Backbone Model
     * @type {*|void|Object}
     */
    isomatic.data.DataModel = Backbone.Model.extend( /** @lends Model.prototype */ {

        /**
         * @class Model
         *
         * @augments Backbone.Model
         * @contructs
         */
        initialize: function () {
            console.log('isomatic.options.Model initialized.');
        }

    });

    /**
     * Raw Data Model
     * The unprocessed Data coming from the Data Import
     *
     * @type {isomatic.data.Model}
     */
    isomatic.data.raw = new isomatic.data.DataModel({

        // Contains the Raw Data
        data: isomatic.options.internal.exampleData,

        // Pasted Data (from Textarea)
        pastedData: ''
    });

    /**
     * Meta Data Model
     * (Calculated) Metainformations about the Raw Data
     *
     * @type {isomatic.data.Model}
     */
    isomatic.data.meta = new isomatic.data.DataModel({

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
     * Processed Data Array
     * @type {Array}
     */
    isomatic.data.processed = [];


}(isomatic));

