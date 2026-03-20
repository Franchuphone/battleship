import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from "html-webpack-plugin";
// import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
// import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

export default {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve( __dirname, 'dist' ),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin( {
            template: "./src/template.html",
        } ),
        // new MiniCssExtractPlugin( {
        //     filename: "[name].css",
        //     chunkFilename: "[id].css",
        // } ),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [ "style-loader", "css-loader" ],
            },
            // {
            //     test: /\.s?css$/,
            //     use: [ MiniCssExtractPlugin.loader, "css-loader", "sass-loader" ],
            // },
            {
                test: /\.html$/i,
                use: [ "html-loader" ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(csv|tsv)$/i,
                use: [ 'csv-loader' ],
            },
            {
                test: /\.xml$/i,
                use: [ 'xml-loader' ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [ '@babel/preset-env' ]
                    }
                }
            },
        ],
    },
    // optimization: {
    //     minimizer: [
    //         `...`,
    //         new CssMinimizerPlugin(),
    //     ],
    // },
};
