# esri-webpack-babel

**UPDATE**: This technique demonstrated in this repository will work, but you should probably use either:
- the newer [@arcgis/webpack-plugin](https://github.com/Esri/arcgis-webpack-plugin) with the ArcGIS API v4.7+
- or [esri-loader](https://github.com/Esri/esri-loader/) with the ArcGIS API v3.x - v4.6

Read this [blog post](https://community.esri.com/people/TWayson-esristaff/blog/2018/05/10/arcgiswebpack-plugin-vs-esri-loader) for more information.

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
 1. [exclude Esri and Dojo modules](webpack.config.js#L50-L53) from the local build
 1. [load the ArcGIS API for JavaScript via a script tag](src/app/index.html#L33) (in this case from the CDN)
 1. use the [Dojo loader](https://dojotoolkit.org/reference-guide/1.10/loader/) that is included in the ArcGIS API for JavaScript to [load webpack's bundled output via a `require()` statement](src/app/index.html#L39)

After you've taken these steps you will be able to use ES2015 import statements like `import Map from 'esri/map';` to reference Esri modules.

This repository uses [v3.x of the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/3/), but the same technique works just as well with [v4.x](https://developers.arcgis.com/javascript/latest/guide/discover/index.html).

## Integrating with other libraries

### Non-Dojo lbraries
For any non-Dojo libraries (jQuery, d3, etc) you can include them in your webpack bundles as you normally would.

### Dojo lbraries
For Dojo libraries you will need to take a few additional steps:
 1. [configure the Dojo loader with the location of the package](src/app/index.html#L20-L31)
 1. [exclude the package](webpack.config.js#L57) from the local build

## Known limitations of this approach
Since the entire application is being loaded via the ArcGIS API for JavaScript, you cannot lazy load it and must incur the cost of downloading that script before users can interact with your app.

Also, [this approach is not yet working with angular-cli](https://github.com/tomwayson/angular2-esri-example/issues/16).

If either of those are requirements for your application, you can try the approach demonstrated in [esri-angular-cli-example](https://github.com/tomwayson/esri-angular-cli-example).

## Why is this needed?
[This blog post](http://tomwayson.com/2016/11/27/using-the-arcgis-api-for-javascript-in-applications-built-with-webpack/) explains how libraries like this provide a workaround to the challenges of loading ArcGIS API for JavaScript modules from bundlers like [webpack](http://webpack.github.io/).

[Dojo loader]:https://dojotoolkit.org/reference-guide/1.10/loader/
