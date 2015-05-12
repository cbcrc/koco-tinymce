//Éditeur de sosurce
tinyMCEPopup.requireLangPack();
tinyMCEPopup.onInit.add(onLoadInit);

function saveContent() {
    var content = document.getElementById('htmlSource').value.replace(
        /&nbsp;/g,
        '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="nonbreaking' + ((!tinyMCEPopup.editor.plugins.advvisualchars || !tinyMCEPopup.editor.plugins.advvisualchars.state) ? ' hidden' : '') + '"/>'
    );

    tinyMCEPopup.editor.setContent(content, { source_view: true });
    tinyMCEPopup.close();
}

function onLoadInit() {
	tinyMCEPopup.resizeToInnerSize();

	// Remove Gecko spellchecking
	if (tinymce.isGecko)
		document.body.spellcheck = tinyMCEPopup.editor.getParam("gecko_spellcheck");

	var $div = $('<div>');
	var content = tinyMCEPopup.editor.getContent({ source_view: true }).replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ');
	$div.append(content).find('.nonbreaking').replaceWith('&nbsp;');
	document.getElementById('htmlSource').value = $div.html();

	if (tinyMCEPopup.editor.getParam("theme_advanced_source_editor_wrap", true)) {
		turnWrapOn();
		document.getElementById('wraped').checked = true;
	}

	resizeInputs();
}

function setWrap(val) {
	var v, n, s = document.getElementById('htmlSource');

	s.wrap = val;

	if (!tinymce.isIE) {
		v = s.value;
		n = s.cloneNode(false);
		n.setAttribute("wrap", val);
		s.parentNode.replaceChild(n, s);
		n.value = v;
	}
}

function setWhiteSpaceCss(value) {
	var el = document.getElementById('htmlSource');
	tinymce.DOM.setStyle(el, 'white-space', value);
}

function turnWrapOff() {
	if (tinymce.isWebKit) {
		setWhiteSpaceCss('pre');
	} else {
		setWrap('off');
	}
}

function turnWrapOn() {
	if (tinymce.isWebKit) {
		setWhiteSpaceCss('pre-wrap');
	} else {
		setWrap('soft');
	}
}

function toggleWordWrap(elm) {
	if (elm.checked) {
		turnWrapOn();
	} else {
		turnWrapOff();
	}
}

function resizeInputs() {
	var vp = tinyMCEPopup.dom.getViewPort(window), el;

	el = document.getElementById('htmlSource');

	if (el) {
		el.style.width = (vp.w - 20) + 'px';
		el.style.height = (vp.h - 65) + 'px';
	}
}
