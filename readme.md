# esri-webpack-babel

A bare bones example showing how to use the
[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) in an application built with [webpack](https://webpack.github.io/) and  [Babel](https://babeljs.io/) to compile ES2015 modules.

Bundles application code via webpack, while pulling in the ArcGIS API for JavaScript (and Dojo) via CDN.

## Running the demo

```
npm install
npm run build
```

Then serve the root folder using your favorite web server, such as [http-server](https://www.npmjs.com/package/http-server) and open src/app/index.html in a browser.

## How it works

The approach demonstrated here uses webpack to bundle your application code, but loads the ArcGIS API for JavaScript from a pre-build distribution. The key steps are to:
 1. [configure webpack to output the bundle as an AMD module](webpack.config.js#L17)
 1. [exclude Esri and Dojo modules](webpack.config.js#L47-L50) from the local build
 1. [load the ArcGIS API for JavaScript via a script tag](src/app/index.html#L33) (in this case from the CDN)
 1. use the [Dojo loader](https://dojotoolkit.org/reference-guide/1.10/loader/) that is included in the ArcGIS API for JavaScript to [load webpack's bundled output via a `require()` statement](src/app/index.html#L39)

After you've taken these steps you will be able to use ES2015 import statements like `import Map from 'esri/map';` to reference Esri modules.

This repository uses [v3.x of the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/3/), but the same technique works just as well with [v4.x](https://developers.arcgis.com/javascript/latest/guide/discover/index.html).

## Integrating with other libraries

### Non-Dojo lbraries
For any non-Dojo libraries (jQuery, d3, etc) you can include them in your webpack bundles as you normally would.

### Dojo lbraries
For Dojo libraries you will need to take a few additional steps:
 1. [configure the Dojo loader with the location of the package](src/app/index.html#L20-L21)
 1. [exclude the package](webpack.config.js#L54) from the local build

## Known limitations of this approach
Since the entire application is being loaded via the ArcGIS API for JavaScript, you cannot lazy load it and must incur the cost of downloading that script before users can interact with your app.

Also, [this approach is not yet working with angular-cli](https://github.com/tomwayson/angular2-esri-example/issues/16).

If either of those are requirements for your application, you can try the approach demonstrated in [angular-cli-esri](https://github.com/tomwayson/angular-cli-esri).

## Why do it this way?

The reason for taking this unconventional and roundabout approach is that the ArcGIS API for JavaScript is built with Dojo.
Because Dojo implements the [AMD specification](https://en.wikipedia.org/wiki/Asynchronous_module_definition) diffently than other module loaders,
the only reliable way to load Dojo AMD modules is to use the Dojo loader.

### What about [dojo-webpack-loader]?
There is a webpack loader for Dojo modules, [dojo-webpack-loader], but [it currently doesn't work with the ArcGIS API for JavaScript](https://github.com/Nordth/dojo-webpack-loader/issues/7).

Even once someone fixes the above issues there would be a few reasons why you might not want to use that approach,
at least not until someone figures out the following.

Dojo's AMD architecture encourages writing large libraries out of many small modules. To strike a balance between the number and size of script requests,
Dojo encourages using [their build tool](https://dojotoolkit.org/reference-guide/1.10/build/) to bundle the modules into "layers"
that include only the primary modules needed by your application. Other modules not included in the build layers
will be loaded asynchronously as needed at runtime. This means those unbundled files must be present on the web server,
or all modules will have to be included in the bundles. Someone would have to figure out the best way to handle that with webpack.

For another thing, look at the webpack output from the [dojo-webpack-loader examples].
The word "webpack" appears 659 times in [dgrid_02_stores.bundle.js](https://rawgit.com/Nordth/dojo-webpack-loader-examples/master/bundle/dgrid_02_stores.bundle.js).
Sure, that output has not been optimized, but even once it is, it's hard to imagine it being any smaller than the output of a Dojo build
(which is plenty large enough as it is).

Finally, Dojo builds of the ArcGIS API for JavaScript typically take around 90 seconds to complete due to the large number of files.
Someone will have to figure out how to configure webpack to avoid doing that everytime you save one of your application files.

In short, there's more work to do before actually loading and bundling the ArcGIS API for JavaScript modules via webpack
is a viable alternative to the approach demonstrated by this repository.
If for some reason you absolutely need to do a single file build, a Dojo build is still your best option.
Otherwise, when using webpack, it's best to just think of the pre-built ArcGIS API for JavaScript as a "pre-entry" [chunk](http://webpack.github.io/docs/code-splitting.html#entry-chunk).

FYI - This pattern also [works with Rollup](https://github.com/tomwayson/esri-rollup-example) as well as webpack,
if that makes you feel any better about using what may seem like an unconventional approach.

## Do we have to use the CDN?

No. Some developers may not be able to access the CDN from their environment, while others will think that CDNs just aren't cool.
You should be able to use any of the [other ways to get the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/3/jshelp/intro_accessapi.html)
such as a locally hosted [Bower build](https://developers.arcgis.com/javascript/3/jshelp/intro_accessapi.html#using-bower-for-local-builds) or [SDK download](https://developers.arcgis.com/javascript/3/jshelp/intro_accessapi.html#download-api)
in the same way that this repository uses the CDN version.

[dojo-webpack-loader]:https://github.com/Nordth/dojo-webpack-loader/
[Dojo loader]:https://dojotoolkit.org/reference-guide/1.10/loader/
[dojo-webpack-loader examples]:https://github.com/Nordth/dojo-webpack-loader-examples
