const VERSION_INT = '1';
const Timestamp = new Date().getTime();
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const productionGzipExtensions = ['html', 'js', 'css'];
function resolve(dir) {
	return path.join(__dirname, dir);
}
module.exports = {
	devServer: {
		port: 8888,
		client: {
			overlay: false
		}
	},
	publicPath: './',
	lintOnSave: false,
	chainWebpack: (config) => {
		config.plugin('html').tap((args) => {
			args[0].title = '出货单据打印系统';
			return args;
		});
		config.resolve.alias.set('@', resolve('src'));
	},
	outputDir: 'companyDist',
	productionSourceMap: false,
	configureWebpack: {
		// webpack 配置
		output: {
			// 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
			filename: `[name].${Timestamp}.${VERSION_INT}.js`,
			chunkFilename: `[name].${Timestamp}.${VERSION_INT}.js`,
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: `css/[name].${Timestamp}.${VERSION_INT}.css`,
			}),
		],
	},
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					modifyVars: {},
					javascriptEnabled: true,
				},
			},
		},
	},
	transpileDependencies: true,
	runtimeCompiler: true
};