var webpack = require('webpack');

module.exports = {
    entry: {
        main: [
            './src/app/main.js' // entry point for your application code
        ],
        vendor: [
            // put your third party libs here
        ]
    },
    output: {
        filename: './dist/[name].bundle.js',
        publicPath: './',
        // the bundled output will be loaded by the Dojo AMD loader
        // that is included in the ArcGIS API for JavaScript
        libraryTarget: 'amd'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },
    module: {
        loaders: [
            // ES2015 files
            {
              test: /\.(js|jsx)$/,
              loader: 'babel-loader'
            },
            // css
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        })
    ],
    externals: [
        function(context, request, callback) {
            // exclude any esri or dojo modules from the bundle
            // these are included in the ArcGIS API for JavaScript
            // and its Dojo loader will pull them from its own build output
            if (/^dojo/.test(request) ||
                /^dojox/.test(request) ||
                /^dijit/.test(request) ||
                /^esri/.test(request) ||
                // ordinarily you would only need to speficy the above prefixes,
                // but because we include a third-party Dojo module in this example
                // we need to add it's package to the list of prefixes to exclude
                /^cluster-layer-js/.test(request)
            ) {
                return callback(null, 'amd ' + request);
            }
            callback();
        }
    ],
    devtool: 'source-map'
};
