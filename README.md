# koco-tinymce
Knockout components compatible version of TinyMCE editor

##Installation

To come

##Configuration

Because TinyMCE attempts to load its own plugins and styles once it's initialized, it doesn't necessarily play nice with Koco's build process, if using the RequireJS Optimizer. You have to set the tinymce path explicitly in `tinymce-config.js`:

```javascript
    window.tinyMCEPreInit = {
    	suffix: '_src',
        base : '[path to tinymce src file]'
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
	    '[path to tinymce folder]/**/**/**/**/*',
	    './src/bower_components/koco-tinymce/src/**/**/*.css'
	];
```

Finally, make sure you load and init the custom plugins.

```
define([
        'bower_components/koco-tinymce/src/plugins/images-mce',
        'bower_components/koco-tinymce/src/plugins/link-mce',
        'bower_components/koco-tinymce/src/plugins/photo-album-mce',
        'bower_components/koco-tinymce/src/plugins/external-multimedia-content-mce',
        'bower_components/koco-tinymce/src/plugins/html-snippet-mce',
        'bower_components/koco-tinymce/src/plugins/shortcuts-mce',
        'bower_components/koco-tinymce/src/plugins/mce-button-toggler'
    ],
    function(
            images,
            link,
            photoAlbum,
            externalMultimediaContent,
            htmlSnippet,
            shortcuts,
            buttonToggler
        ) {
            'use strict';

            images.init();
            link.init();
            photoAlbum.init();
            externalMultimediaContent.init();
            htmlSnippet.init();
            shortcuts.init();
            buttonToggler.init();

        return;
    });
```
##Usage

To come