## About isomatic
### Functionality
Tired of creating isotype graphics manually? We've created a web application ([www.isomatic.de](http://www.isomatic.de)) that does all the heavy lifting for you and still leaves you with the opportunity to customize it in your favorite vector graphics editor like Adobe Illustrator.

You start by importing your data via copy'n'paste from a spreadsheet application, like Excel or Numbers. The application gives you the choice between several isotype layouts. A broad library contains many custom designed icons and many options to layout and design the graphic. If you seek help, the interactive tour will guide you throughout the whole process.

We started this project in 2013 as students of the University of Applied Sciences in Augsburg and released it as OpenSource.

Isomatic is a web application that runs in your browser that lets you easily create isotype graphics. The resulting graphics can be downloaded as SVG files which can be imported to several other applications. There are many customization options - but see for yourself at !
Isomatic is free to use and OpenSource at GitHub!

### History
Isomatic was first created 2013 as part of a seminar at the Univsity of Applied Sciences Augsburg. A first Version was released late 2013 which contained all the basic funtionality. In 2014 we've added some more advanced layouting capabilities, an interactive tour and a few minor improvements here and there.

### The Team
Lisa Borgenheimer: B. A. Communication Design, currently studing M. A. Interactive Media Systems. Working as Freelancer and Information Designer for Süddeutsche Zeitung and ZEIT ONLINE.

Simon Heimler: B. A. Interactive Media, currently studing M. S. of Applied Research. Specialized in Mobile and Web Development, Semantic Web Technologies, Content Management and Data Visualization.

Sebastian Huber: B. A. Interactive Media, currently studing M. A. Interactive Media Systems. Working as a Fullstack Webdeveloper.


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
