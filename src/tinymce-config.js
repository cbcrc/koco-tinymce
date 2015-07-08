define([], function() {
	'use strict';

	if (!window.hasOwnProperty('tinyMCEPreInit')) {
	    window.tinyMCEPreInit = {
	    	suffix: '',
	        base : '/wam/bower_components/koco-tinymce/non_bower_components/tinymce'
	    };
	}
});