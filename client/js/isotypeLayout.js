/* jshint jquery:true, devel: true */
/* global isomatic, d3 */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

/**
 * Isotype Layout
 * 2013 Simon Heimler
 * @returns {Function}
 */
d3.layout.isotype = function() {
    "use strict";

    var value = Number;

    function isotype(data) {

        var iconData = [];

        console.dir(data);

//        // Compute the numeric values for each data element.
//        var values = data.map(function(d, i) { return +value.call(isotype, d, i); });
//
//        // Compute the start angle.
//        var a = +(typeof startAngle === "function"
//            ? startAngle.apply(this, arguments)
//            : startAngle);
//
//        // Compute the angular scale factor: from value to radians.
//        var k = ((typeof endAngle === "function"
//            ? endAngle.apply(this, arguments)
//            : endAngle) - a)
//            / d3.sum(values);
//
//        // Optionally sort the data.
//        var index = d3.range(data.length);
//        if (sort != null) index.sort(sort === d3_layout_isotypeSortByValue
//            ? function(i, j) { return values[j] - values[i]; }
//            : function(i, j) { return sort(data[i], data[j]); });
//
//        // Compute the arcs!
//        // They are stored in the original data's order.
//        var arcs = [];
//        index.forEach(function(i) {
//            var d;
//            arcs[i] = {
//                data: data[i],
//                value: d = values[i],
//                startAngle: a,
//                endAngle: a += d * k
//            };
//        });

        return iconData;
    }

    /**
     * Specifies the value function *x*, which returns a nonnegative numeric value
     * for each datum. The default value function is `Number`. The value function
     * is passed two arguments: the current datum and the current index.
     */
    isotype.value = function(x) {
        if (!arguments.length) return value;
        value = x;
        return isotype;
    };



    return isotype;
};
