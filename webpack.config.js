const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { merge } = require("webpack-merge");

require("@babel/polyfill");

// module.exports = {
// //진입점 => entry : 가장먼저 실행될 파일
// entry: {
//     app: ["@babel/polyfill", path.join(__dirname, "main.js")],
// },
// // 결과물에 대한 설정
// output: {
//     filename: "[name].js", //app.js  -> entry의 별칭 이름이 적용된다.
//     path: path.join(__dirname, "dist"),
// },
// module: {
//     rules: [
//         {
//             test: /\.vue$/,
//             use: "vue-loader",
//         },
//         {
//             test: /\.js$/,
//             exclude: /node_modules/, //제외할 폴더 or 파일을 입력한다.
//             use: "babel-loader",
//         },
//         {
//             test: /\.css$/,
//             use: ["vue-style-loader", "css-loader"],
//         },
//     ],
// },
// plugins: [
//     new VueLoaderPlugin(),
//     new HtmlWebpackPlugin({
//         template: path.join(__dirname, "index.html"),
//     }),
//     new CopyPlugin({
//         patterns: [
//             {
//                 from: "assets/",
//                 to: "", //비워두면 output에서 설정한 경로로 지정된다.
//             },
//         ],
//     }),
// new CleanWebpackPlugin()
// ],
// devServer: {
//     open: false,
//     hot: true
// },
// devtool: "eval"
// };

module.exports = (env, opts) => {
    const config = {
        // 중복되는 옵션들
        resolve: {
            extensions: [".vue", ".js"],
            alias: {
                "~": path.join(__dirname),
                scss: path.join(__dirname, "./scss"),
            },
        },
        //진입점 => entry : 가장먼저 실행될 파일
        entry: {
            app: ["@babel/polyfill", path.join(__dirname, "main.js")],
        },
        // 결과물에 대한 설정
        output: {
            filename: "[name].js", //app.js  -> entry의 별칭 이름이 적용된다.
            path: path.join(__dirname, "dist"),
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: "vue-loader",
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/, //제외할 폴더 or 파일을 입력한다.
                    use: "babel-loader",
                },
                {
                    test: /\.css$/,
                    use: [
                        //순서 중요
                        "vue-style-loader",
                        "css-loader",
                        "postcss-loader",
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        //순서 중요
                        "vue-style-loader",
                        "css-loader",
                        "postcss-loader",
                        "sass-loader",
                    ],
                },
            ],
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "index.html"),
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: "assets/",
                        to: "", //비워두면 output에서 설정한 경로로 지정된다.
                    },
                ],
            }),
        ],
    };
    //개발용
    if (opts.mode === "development") {
        return merge(config, {
            //추가 개발용 옵션
            devtool: "eval",
            devServer: {
                open: false,
                hot: true,
            },
        });

        //제품용
    } else {
        return merge(config, {
            //추가 제품용 옵션
            devtool: "cheap-module-source-map",
            plugins: [new CleanWebpackPlugin()],
        });
    }
};
