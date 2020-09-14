var initRootJS = function() {
	console.log("Initialisation.");
	
	// Test StringRJS
	let sentence = "test-de-phrase.";
	sentence = StringRJS.replace(sentence, {"-": " " });
	console.log(StringRJS.ucfirst(sentence));
	
	// Test Integer 
	console.log(IntegerRJS.random(2, 100));
	
	// Test Ajax
	// Succès Texte
	(new AjaxRequestRJS({
		'url': 'ajax.php',
		'params': {
			'type': 'text'
		},
		'onComplete': function() {
			console.log('AjaxRequest 1 complete');
		},
		'onSuccess': function(response) {
			console.log('AjaxRequest 1 success : ' + response);
		}
	}));
	
	// Echec texte 1
	(new AjaxRequestRJS({
		'url': 'ajax2.php?type=text',
		'onComplete': function(response) {
			console.log('AjaxRequest 2 complete');
		},
		'onSuccess': function(response) {
			console.log('AjaxRequest 2 success : ' + response);
		},
		'onError': function(response) {
			console.log('AjaxRequest 2 error 1 : ' + response);
		}
	}));
	// Echec texte 2
	(new AjaxRequestRJS({
		'url': 'ajax.php?key=value&key2=value2',
		'params': {
			'type': 'text',
			'with-error': 1
		},
		'onComplete': function(response) {
			console.log('AjaxRequest 3 complete');
		},
		'onSuccess': function(response) {
			console.log('AjaxRequest 3 success : ' + response);
		},
		'onError': function(response) {
			console.log('AjaxRequest 3 error : ' + response);
		}
	}));
	// Succès JSON Ajax
	(new JsonAjaxRequestRJS({
		'url': 'ajax.php?type=json',
		'onComplete': function() {
			console.log('AjaxRequest JSON 1 complete');
		},
		'onSuccess': function(response) {
			console.log('AjaxRequest JSON 1 success : ', response);
		}
	}));
	// Echec JSON Ajax
	(new JsonAjaxRequestRJS({
		'url': 'ajax.php',
		'method': 'post',
		'params': {
			'type': 'json',
			'with-error': 1  
		},
		'onComplete': function() {
			console.log('AjaxRequest JSON 2 complete');
		},
		'onSuccess': function(response) {
			console.log('AjaxRequest JSON 2 success : ', response);
		},
		'onError': function(response) {
			console.log('AjaxRequest JSON 2 error : ', response);
		}
	}));
	
	let menu = ElementRJS.searchOne('div.menu');
	console.log(menu);
	
	console.log(ElementRJS.searchOne('li.selected', menu));
	
	ElementRJS.searchList('li', menu).forEach(function(li) {
		console.log(li);
		li.addEvent('click', function(event) {
			let element = ElementRJS.retrieve(this),
				previous = element.getPrevious()
			;
			console.log(element);
		});
	});
	
	// Test sur la recherche d'éléments
	var contentDiv = ElementRJS.searchOne('div.content'),
		element = ElementRJS.searchOne("ul.two li.second"),
		previous = element.getPrevious("li"),
		next = previous.getNext("li"),
		parent = element.getParent('div.page'),
		child = element.getChild('ul li.selected'),
		children = element.getChildren('li.selected'),
		last = parent.getLast('li')
	;
	
	// Vérification sur le même élément
	let contentDivSameElement = contentDiv.sameElement(ElementRJS.searchOne('div.content')),
		contentDivNotSameElement = contentDiv.sameElement(ElementRJS.searchOne('li'))
	;
	
	console.log('contentDiv.sameElement(ElementRJS.searchOne(\'div.content\') : ' + contentDivSameElement);
	console.log('contentDiv.sameElement(ElementRJS.searchOne(\'li\') : ' + contentDivNotSameElement);
	
	// Test d'ajout d'éléments
	parent.addElement(new ElementRJS('p', {
		'text': 'Paragraphe en haut'
	}), 'top');
	
	parent.addElement(new ElementRJS('p', {
		'text': 'Paragraphe en bas'
	}), 'bottom');
	
	contentDiv.addElement(new ElementRJS('p', {
		'text': 'Paragraphe avant le contenu'
	}), 'before');
	
	contentDiv.addElement(new ElementRJS('p', {
		'text': 'Paragraphe après le contenu',
		'data-text': 'Paragraphe après le contenu'
	}), 'after');
	
	contentDiv.addElement(new ElementRJS('input', {
		'type': 'text'
	}));
	
	console.log('Test previous :', previous);
	console.log('Test next :', next);
	console.log('Test parent :', parent);
	console.log('Test child :', child);
	console.log('Test children: ', children);
	console.log('test last :', last);
	
	// Test de modification de propriétés
	last.setProperty('text', 'Last');
	last.setProperty('data-last', 1);
	
	let input = contentDiv.getChild('input');
	input.setProperty('value', 'Texte');
	
	console.log('Test getProperty Text :', input.getProperty('value'));
	
	// Test de manipulation de classes
	last.addClass('last');
	
	input.addClasses([ 'input', 'input-text' ]);
	console.log('Input has class input :', input.hasClass('input-text'));
	input.removeClass('input-text');
	console.log('Input has class input after removeClass:', input.hasClass('input-text'));
	
	// Tests sur les événements
	
	parent.getChild('p[data-text]').addEvent('begin-taping', function(param1, param2) {
		let element = ElementRJS.retrieve(this);
		console.log(param1);
		console.log(param2)
		element.setProperty('text', 'Ecriture en cours...');
	});
	
	parent.getChild('p[data-text]').addEvent('end-taping', function() {
		let element = ElementRJS.retrieve(this);
		element.setProperty('text', element.getProperty('data-text'));
	});
	
	input.addEvent('focus', function(event) {
		parent.getChild('p[data-text]').fireEvent('begin-taping', [ 'param1Value', 'param2Value' ]);
		let currentElement = ElementRJS.retrieve(this);
		currentElement.setStyles({
			'color': 'red'
		});
		
		console.log('Nouvelle couleur :', currentElement.getStyle('color'));
	});
	
	input.addEvent('blur', function(event) {
		parent.getChild('p[data-text]').fireEvent('end-taping');
		let currentElement = ElementRJS.retrieve(this);
		currentElement.setStyles({
			'color': 'black'
		});
		console.log('Nouvelle couleur :', currentElement.getStyle('color'));
	});
	
	// Test de récupération de dimension
	let fullWidthParagraph = ElementRJS.searchOne('p').getOuterDimension('width'),
		fullHeightParagraph = ElementRJS.searchOne('p').getOuterDimension('height')
	;
	console.log('Largeur avec marge du premier paragraphe : ' + fullWidthParagraph);
	console.log('Hauteur avec marge du premier paragraphe : ' + fullHeightParagraph);
	
	// Test de suppression d'élément
	parent.getLast('p').remove();
	
	// Test de suppression d'un enfant
	let childToDeleted = menu.getChild('li.selected');
	childToDeleted.getParent('ul').removeChild(childToDeleted);
	
	//contentDiv.removeChildren();
	
	// Calcul des valeurs offset
	let inputOffsetTop = input.computeOffset('top'),
		inputOffsetLeft = input.computeOffset('left')
	;
	console.log('Input offset top :', inputOffsetTop);
	console.log('Input offset left :', inputOffsetLeft);
	
	// Gestion de l'offset vertical
	let buttonOffsetTopControl = new ElementRJS('button', {
		'type': 'button',
		'text': 'Test scrollToTop'
	});
	
	buttonOffsetTopControl.addEvent('click', function(event) {
		contentDiv.setStyles({
			'min-height': '2000px'
		});
		
		let offsetTopTarget = ElementRJS.searchOne('body').getLast('p').computeOffset('top');
		ElementRJS.retrieve(document.scrollingElement).changeScroll({
			'top': offsetTopTarget
		});
	});
	
	contentDiv.addElement(buttonOffsetTopControl);
	
	// Gestion de l'offset horizontal
	let buttonOffsetLeftControl = new ElementRJS('button', {
		'type': 'button',
		'text': 'Test scrollToLeft'
	});
	
	buttonOffsetLeftControl.addEvent('click', function(event) {
		contentDiv.setStyles({
			'min-width': '2000px'
		});
		
		ElementRJS.retrieve(document.scrollingElement).changeScroll({
			'left': 1500
		});
	});
	
	contentDiv.addElement(buttonOffsetLeftControl);
	
	// Test de téléchargement de fichier
	let inputFile = ElementRJS.searchOne('input[type=file]');
	console.log(inputFile);
	inputFile.addEvent('change', function() {
		let formData = new FormData;
		formData.append('file', ElementRJS.retrieve(this).getProperty('files')[0]);
		formData.append('type', 'upload-file');
		
		/*let formData = {
			type: 'upload-file',
			file: ElementRJS.retrieve(this).getProperty('files')[0]
		};*/
		
		new UploadAjaxRequestRJS({
			'url': 'ajax.php',
			'params': formData,
			'onProgress': function(event) {
				let percent = 100 * ((event.total != 0) ? (event.loaded / event.total) : 0);
				
				console.log(percent + ' % téléchargé');
			},
			'onComplete': function() {
				console.log('Fichier téléchargé');
			},
			'onSuccess': function(response) {
				console.log('Succès');
			},
			'onError': function(response) {
				console.log(response);
			}
		});

	});
};

document.addEventListener("DOMContentLoaded", function() { 
	(new ControllerRJS()).execute();
}, false);