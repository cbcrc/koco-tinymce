# koco-tinymce
Knockout components compatible version of TinyMCE editor

##Installation

To come

##Configuration

Because TinyMCE attempts to load its own plugins and styles once it's initialized, it doesn't necessarily play nice with Koco's build process, if using the RequireJS Optimizer. You have to set the tinymce path explicitly in `tinymce-config.js`:

```javascript
    window.tinyMCEPreInit = {
    	suffix: '',
        base : '/[your app directory]/bower_components/koco-tinymce/non_bower_components/tinymce'
    };
```
You'll probably want to copy that file out of the `src/bower_components/koco-tinymce/src` directory and put it somewhere where it won't get overwritten next time you do a `bower update`. Then in your `require.config` file:

```javascript
var require = {
	...
    paths: {
    ...
		'tinymce-config': '[your_path_to]/tinymce-config',
	...
```

You will also need to tell the optimizer to include any dynamically loaded files in your `/dist` folder. In `gulpfile.js`:

```javascript
	global.folders = [
	    './src/web.config',
	    ...
	    './src/bower_components/koco-tinymce/non_bower_components/tinymce/**/**/**/**/*',
	    './src/bower_components/koco-tinymce/src/**/**/*.css'
	];
```

##Usage

To come