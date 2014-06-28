## About isomatic
### Functionality
Isomatic is a web application that runs in your browser that lets you easily create isotype graphics. The resulting graphics can be downloaded as SVG files which can be imported to several other applications. There are many customization options - but see for yourself at [www.isomatic.de](http://www.isomatic.de)!
Isomatic is free to use and OpenSource at GitHub!

### Background
Isotype graphics are a special subtype of infographics ... [TODO: Lisa]

### History
Isomatic was first created 2013 as part of a seminar at the Univsity of Applied Sciences Augsburg. A first Version was released late 2013 which contained all the basic funtionality. In 2014 we've added some more advanced layouting capabilities, an interactive tour and a few minor improvements here and there.

### The Team
Isomatic is an university project by Lisa Borgenheimer, Simon Heimler and Sebastian Huber. 

## Installation
This project uses 3rd party programs for pependency & build management.
To get this project running follow these steps:
Dont forget to prepend sudo if using linux or mac.

### Prequisites
* Install Nodejs (http://www.nodejs.org)
* Install Sass (http://sass-lang.com/install). This may require Ruby (https://www.ruby-lang.org)
* Install Bower globally `npm install -g bower` (http://bower.io)
* Install Grunt globally `npm install -g grunt-cli` (http://gruntjs.com)

### Install Dependencies & Build Project
Switch to project directory.

* Install missing Grunt Plugins via `npm install` in the project directory
* Install JavaScript dependencies via Bower: `bower install` in the project directory
* Run the project watch tasks (live sass compilation) via `grunt` in the project directory

## Updating
* Update dependencies via: `bower update` in the project directory
* Update grunt plugins via `npm update`
* Update JSDoc Documentation via `bower jsdoc`
* Update Minified JavaScript via `bower build`

Some 3rd Party Libraries may change in a way that the app can be broken.
If that happens, insert a specific version number into the bower.json file to revert to an older state
