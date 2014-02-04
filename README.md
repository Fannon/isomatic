# isomatic
isomatic is an interactive Isotype Graphics Generator.
It can be used online at http://www.isomatic.de

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
