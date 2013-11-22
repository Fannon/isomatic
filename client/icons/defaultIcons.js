/* jshint jquery:true, devel: true */
/* global isomatic, d3 */

///////////////////////////////////////////////////////
// isomatic                                          //
///////////////////////////////////////////////////////
// An Interactive Isotype Graphics Generator         //
// https://github.com/Fannon/isomatic                //
///////////////////////////////////////////////////////

/**
 * Default Icons in JSON Notation
 *
 * This defines both categories and the icons within
 */
isomatic.vis.defaultIcons = {
    'mathematics': {
        'name': 'Mathematic Icons',
        'icons': {
            'addition': {
                name: "Addition",
                width: 64,
                height: 64,
                svg: '<g id="icon-addition"><path fill-rule="evenodd" clip-rule="evenodd" d="M25.467,12.585c0,2.374,0,7.005,0,10.068c0,1.657-1.343,3.001-3,3.001H12.286c0,0-3.616,0.197-3.616,3.576v5.37c0,0-0.12,4.12,3.496,4.12h10.301c1.657,0,3,1.343,3,3v10.029c0,0,0,3.729,3.616,3.729h5.599c0,0,3.849-0.23,3.849-3.5v-10.24c0-1.657,1.343-3,3-3h9.948c0,0,3.852,0.062,3.852-3.674V29.23c0,0-0.117-3.558-3.731-3.558H41.65c-1.657,0-3-1.343-3-3v-7.16c0-1.657-0.146-4.393-1.192-5.595c-0.564-0.646-1.378-1.16-2.542-1.16c-3.15,0-5.719,0.062-5.719,0.062S25.467,8.856,25.467,12.585z"/></g>'
            }
        }
    }
};