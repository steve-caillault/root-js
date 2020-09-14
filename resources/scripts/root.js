/**
 * Gestion d'une animation sur un élément HTML
 */
class AnimationRJS {
	
	// duration: null, // entier en millisecondes
	// stepFunction: null, // fonction à exécuter pour chaque segment
	// startTime: null
	
	/**
	 * Constructeur
	 * @param callable stepFunction Fonction à appeler pour chaque étape de l'animation
	 * @param float duration Temps de l'animation en millisecondes
	 */
	constructor(stepFunction, duration) {
		
		this.stepFunction = stepFunction;
		this.duration = duration;
		this.startTime = null;
		
		this.execution();
	};
	
	/**
	 * Effectut une étape de l'animation
	 * @param float currentTime (DOMHighResTimeStamp) 
	 * @see https://developer.mozilla.org/fr/docs/Web/API/DOMHighResTimeStamp
	 * @return void
	 */
	step(currentTime) {

		if(this.startTime == null) {
			this.startTime = currentTime;
		}
		
		let ratio = (currentTime - this.startTime) / this.duration;
		
		this.stepFunction(ratio);
		
		if(ratio <= 1) {
			window.requestAnimationFrame(this.step.bind(this));
		}
		
	};
	
	/**
	 * Exécute l'animation
	 * @return void
	 */
	execution() {
		
		window.requestAnimationFrame(this.step.bind(this));
		
	};
	
}
/**
 * Classe gérant des entiers
 */
class IntegerRJS  { 
	
	/**
	 * Retourne un entier entre les valeurs en paramètre
	 * @param int min
	 * @param int max
	 * @return int
	 */
	static random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
}
/**
 * Classe gérant des chaines de caractères
 */
class StringRJS {
	
	/**
	 * Retourne une chaine en remplaçant les clés du tableau replacePairs par ses valeurs dans la chaine de caractère 
	 * Il s'agit d'un équivalent de la fonction PHP strtr (http://php.net/manual/fr/function.strtr.php)
	 * @param string string Chaine à modifier
	 * @param object from Tableau des correspondances
	 * @return string
	 */
	static replace(string, replacePairs) {
		for(var key in replacePairs) {
			var value = replacePairs[key];
			string = string.replace(new RegExp(key, 'g'), value);
		}
		return string;
	};
	
	/**
	 * Retourne un identifiant unique
	 * @return string
	 */
	static uniqueId() {
		
		var intervalsByType = {
				'letter': { 'min': 97, 'max': 122 },
				'integer': { 'min': 48, 'max': 57 }
			},
			characterTypes = Object.keys(intervalsByType),
			iteration = IntegerRJS.random(5, 10),
			identifiers = [],
			numberCharacters, characterType, intervals, i, j
		;
		
		for(i = 0 ; i < iteration ; i++) {
			numberCharacters = IntegerRJS.random(10, 20);
			for(j = 0 ; j < numberCharacters ; j++) {
				characterType = characterTypes[IntegerRJS.random(0, characterTypes.length - 1)];
				
				intervals = intervalsByType[characterType];
				if(! identifiers[i]) {
					identifiers[i] = '';
				}
				identifiers[i] += String.fromCharCode(IntegerRJS.random(intervals['min'], intervals['max']));
			}
		}
		
		return identifiers.join('');
	};
	
	/**
	 * Retourne la chaine en mettant la première lettre en majuscule
	 * @param string string
	 * @return string
	 */
	static ucfirst(string) {
		return (string.charAt(0).toUpperCase() + string.substring(1));
	};
	
}
/**
 * Gestion d'URL ou de pseudo URL
 */
 
class UrlRJS {
	
	// url: null,
	// baseUrl: null,
	// queries: null
	
	constructor(url) {
		this.url = url;
		this.initBaseURL(); 
		this.initQueries();
	};
	
	/**
	 * Initialise l'URL de base, sans les paramètres en GET
	 * @return void
	 */
	initBaseURL() {
		this.baseUrl = this.url;
		
		let indexSeparator = this.url.indexOf('?');
		
		if(indexSeparator != -1) {
			this.baseUrl = this.baseUrl.substring(0, indexSeparator);
		}
	};
	
	/**
	 * Initialise les paramètres en GET
	 * @return void
	 */
	initQueries() {
		
		let indexSeparator = this.url.indexOf('?'),
			queryString = '';
		;

		if(indexSeparator != -1) {
			queryString = this.url.substring(indexSeparator)
		}
		
		this.queries = new URLSearchParams(queryString);
		
	};
	
	/**
	 * Modifit la valeur d'un paramètre en GET
	 * @param string key
	 * @param string value
	 * @return self
	 */
	setQueryParam(key, value) {
		this.queries.set(key, value);
		return this;
	};
	
	/**
	 * Retourne l'URL complète
	 * @return string
	 */
	getHref() {
		let url = this.baseUrl,
			countQueries = 0
		;
		
		this.queries.forEach(function() {
			countQueries++;
		});
		
		
		if(countQueries > 0) {
			url += '?' + this.queries.toString();
			
		}
		
		return url;
	};
	
}
/**
 * Classe gérant un appel Ajax
 */
class AjaxRequestRJS {
	
	// method: null
	// url: null
	// sendData: null
	// isUpload: false
	// onError: null
	// onSuccess: null
	// onComplete: null
	// onProgress: null
	
	constructor(options) {

		options = options || {};
		
		// Récupération de la méthode HTTP
		let self = this,
			method = (options.method || 'get').toLowerCase(),
			allowedMethods = [ 'get', 'post' ],
			// Récupération des paramètres à transmettre
			params = options.params || {},
			sendData = new FormData()
		;
	
		// Validation de la méthode HTTP
		if(allowedMethods.indexOf(method) === -1) {
			throw 'Méthode HTTP interdite.';
		}
		
		// Validation de l'URL de la requête
		if(! options.url) {
			throw 'L\'URL de l\'appel Ajax est manquant.';
		}

		// Construction des paramètres à transmettre
		if(params instanceof FormData) {
			sendData = params;
		} else {
			for(var index in params) {
				sendData.append(index, params[index]);
			}
		}
		
		if(method == 'get') {
			let url = new UrlRJS(options.url),
				queries = url.queries
			;
			
			sendData.forEach(function(value, key) {
				url.setQueryParam(key, value);
			});
			
			options.url = url.getHref();
		}

		// Méthode d'initialisation des méthodes de retour
		let initCallback = function(type) {
			self[type] = function(response) {
				if(options[type] && typeof options[type] === 'function') {
					options[type](response);
				}
			};
		};
		
		// Méthode à éxécuter une fois l'appel terminé
		initCallback('onComplete');
		// Méthode à exécuter en cas de succès
		initCallback('onSuccess');
		// Méthode à éxécuter en cas d'échec
		initCallback('onError');
		// Méthode à éxécuter lors du téléchargement du fichier
		initCallback('onProgress');

		this.method = method.toUpperCase();
		this.url = options.url;
		this.sendData = sendData;
		this.isUpload = (options.isUpload || false);
		
		this.execute();
	};
	
	/**
	 * Exécute la requête
	 */
	execute() {
		
		var self = this,
			request = new XMLHttpRequest()
		;
		
		request.open(this.method, this.url);
		
		request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		
		// Progression du téléchargement
		if(this.isUpload) {
			request.upload.onprogress = function(event) {
				self.onProgress(event);
			};
		}
		
		// Méthode en cas d'échec
		request.onerror = function() {
			this.onError(this.responseText);
		};
		
		// Méthode une fois l'appel terminé
		request.onload = function() {
			self.onComplete();
			if(this.status >= 200 && this.status < 300) {
				self.onResponseSuccess(this.responseText);
			} else {
				self.onResponseError(this.responseText);
			}
		};

		// Envoi de la requête
		request.send(this.sendData);
	};
	
	/**
	 * Méthode à exécuter lorsque la requête échoue
	 * @param string response Réponse de la requête
	 * @return void
	 */
	onResponseError(response) {
		this.onError(response);
	};
	
	/**
	 * Méthode à exécuter lorsque la requête réussit
	 * @param string response Réponse de la requête
	 */
	onResponseSuccess(response) {
		this.onSuccess(response);
	};
	
};

/**
 * Classe gérant un appel Ajax retournant du JSON
 */
class JsonAjaxRequestRJS extends AjaxRequestRJS {
	
	// onValidJsonCallback: null,
	// onInvalidJsonCallback: null,
	 
	/**
	 * Gestion des fonctions d'appel lorsque 
	 */
	onJsonResponse(response) {
	
		let jsonData = {},
			self = this
		;
		
		try {
			jsonData = JSON.parse(response);
		} catch(e) {
			self.onInvalidJsonCallback(response);
			return;
		}
		
		this.onValidJsonCallback(jsonData);
	};
	
	/**
	 * Méthode à exécuter lorsque la requête échoue
	 * @param string response Réponse de la requête
	 * @return void
	 */
	onResponseError(response) {
	
		let self = this;
	
		this.onValidJsonCallback = function(json) {
			self.onError(json);
		};
		
		this.onInvalidJsonCallback = function() {
			self.onError(null);
		};
		
		this.onJsonResponse(response);
	};
	
	/**
	 * Méthode à exécuter lorsque la requête réussit
	 * @param string response Réponse de la requête
	 * @return void
	 */
	onResponseSuccess(response) {
		
		let self = this;
		
		this.onValidJsonCallback = function(json) {
			self.onSuccess(json)
		};
		
		this.onInvalidJsonCallback = function() {
			self.onError(null);
		};
		
		this.onJsonResponse(response);
	};
	
};

/**
 * Classe gérant l'appel Ajax pour le téléchargement d'un fichier
 */
class UploadAjaxRequestRJS extends JsonAjaxRequestRJS {
	
	// isUpload: true
	
	constructor(options) {
		options.isUpload = true;
		options.method = 'post';
		super(options);
		
	};
	
};


/**
 * Contrôleur RootJS
 */

class ControllerRJS {
	
	// settings: null
	
	constructor() {

	};
	
	execute() {
		
		try {
			if(window.initRootJS && typeof window.initRootJS == 'function') {
				window.initRootJS();
			}

		} catch(e) {
			console.log(e);
		}
		
	};
	
};


/**
 * Gestions des événements
 */
EventsRJS = {
	listByElement: {},
	
	add: function(element, type, callback) {
		
		var eventsByType = element.events(type),
			events = element.events()
		;
		
		eventsByType.push(callback);
		events[type] = eventsByType;
		
		EventsRJS.listByElement[element.signature] = events;
		
		element.htmlElement.addEventListener(type, callback);
	},
	
	/**
	 * Déclenche un événement du type en paramètre sur un élément
	 * @param ElementRJS element Elément sur lequel déclencher l'événement
	 * @param string type Nom de l'événement à déclencher
	 * @param array params Paramètres à transmettre à la méthode d'appel
	 * @return void
	 */
	fire: function(element, type, params) {
		
		var events = element.events(type);
		
		events.forEach(function(callback) {
			callback.apply(element.htmlElement, params);
		});
	}
};

/**
 * Création d'élément HTML
 */
class ElementRJS {
	
	// tagName : null, 		// li, a, img, p
	// attributes : null, 	// tableau des attributs
	// htmlElement : null, 	// Objet HTMLElement natif
	// signature : null
	
	constructor(tagName, attributes, htmlElement) {
		
		this.htmlElement = htmlElement || null;
		
		if(this.htmlElement === null) {
			this.tagName = tagName;
			if(this.tagName === 'text') {
				this.attributes = (typeof attributes === 'string') ? attributes : '';
			} else {
				this.attributes = (typeof attributes === 'object') ? attributes : {};
			}
			this.initHtmlElement();
		} else { // Si on instancie depuis un objet htmlElement
			this.tagName = (htmlElement.tagName) ? htmlElement.tagName.toLowerCase() : null;
			this.attributes = {};
			if(htmlElement.attributes) {
				for(var indexAttribute = 0 ; indexAttribute < htmlElement.attributes.length ; indexAttribute++) {
					var attribute = htmlElement.attributes[indexAttribute];
					this.attributes[attribute.name] = attribute.value;
				}
			}
			
		}
		
		if(! this.htmlElement.rjsSignature) {
			this.htmlElement.rjsSignature = StringRJS.uniqueId();
		}
		
		this.signature = this.htmlElement.rjsSignature;
	};
	
	/**
	 * Création de l'élément
	 * @return void
	 */
	initHtmlElement() {
		
		if(this.htmlElement !== null) {
			return;
		}
		
		// Création de l'élément
		var element = document.createElement(this.tagName);
		// Affectation des propriétés HTML
		for(var attributeName in this.attributes) {
			if(attributeName === 'html') {
				element.innerHTML = this.attributes[attributeName];
			} else if(attributeName === 'text') {
				element.appendChild(document.createTextNode(this.attributes[attributeName]));
			} else {
				element.setAttribute(attributeName, this.attributes[attributeName]);
			}
		}
		
		
		this.htmlElement = element;
		
	};
	
	/**
	 * Retourne un élément à partir d'un sélecteur CSS
	 * @param string selector
	 * @return self
	 */
	static searchOne(selector, root) {
		
		root = (root ? root.htmlElement : null) || document;
		
		var htmlElement = root.querySelector(selector);
		if(htmlElement === null) {
			return null;
		}
		return ElementRJS.retrieve(htmlElement);
	};
	
	/**
	 * Retourne une liste d'éléments à partir d'un sélecteur CSS
	 * @param string selector
	 * @return array
	 */
	static searchList(selector, root) {
		root = (root ? root.htmlElement : null) || document;
		
		
		var elements = [],
			nodeList = root.querySelectorAll(selector)
		;
		
		nodeList.forEach(function(element) {
			elements.push(ElementRJS.retrieve(element));
		});

		return elements;
	};
	
	/**
	 * Retourne une instance à partir d'un objet natif HTMLElement
	 * @return self
	 */
	static retrieve(element) {
		return new this(null, null, element);
	};
	
	/**
	 * Retourne si l'élément en paramètre correspond à l'élément courant
	 * @param self element
	 * @return bool
	 */
	sameElement(element) {
		this._htmlElementRequired();
		element._htmlElementRequired();
		
		return (this.signature == element.signature);
	};
	
	/**
	 * Retourne l'élément précédent correspondant au sélecteur en paramètre
	 * @param string selector
	 * @return self
	 */
	getPrevious(selector) {
		this._htmlElementRequired();
		
		let element = this.htmlElement.previousElementSibling;
	
		while(element) {
			if(element.matches(selector)) {
				return ElementRJS.retrieve(element);
			}
			element = element.previousElementSibling;
		}

		return null;
	};
	
	/**
	 * Retourne l'élément suivant correspondant au sélecteur en paramètre
	 * @param string selector
	 * @return self
	 */
	getNext(selector) {
		this._htmlElementRequired();
		
		var element = this.htmlElement.nextElementSibling;
	
		while(element) {
			if(element.matches(selector)) {
				return ElementRJS.retrieve(element);
			}
			element = element.nextElementSibling;
		}

		return null;
	};
	
	/**
	 * Recherche un élément parent
	 * @param string selector Sélecteur du parent à retourner
	 * @return self
	 */
	getParent(selector) {
		this._htmlElementRequired();
		
		var parent = this.htmlElement;
		
        do {
            if (selector && parent.matches(selector)) {
            	return ElementRJS.retrieve(parent);
            }
            parent = parent.parentElement /*|| parent.parentNode*/;
            if(! selector && parent) {
            	return ElementRJS.retrieve(parent);
            }
        } while (parent !== null); 
        return null;
	};
	
	/**
	 * Recherche un élément parmi les enfants de l'élément courant
	 * @param string selector
	 * @return self
	 */
	getChild(selector) {
		this._htmlElementRequired();
		return ElementRJS.searchOne(selector, this);
	};
	
	/**
	 * Recherche les enfants de l'élément courant
	 * @param string selector
	 * @return self
	 */
	getChildren(selector) {
		this._htmlElementRequired();
		return ElementRJS.searchList(selector, this); 
	};
	
	/**
	 * Recherche le dernier élément du sélecteur
	 * @param string selector
	 * @return self
	 */
	getLast(selector) {
		this._htmlElementRequired();
		
		let elements = this.getChildren(selector);
		
		if(elements.length > 0) {
			return elements[elements.length - 1];
		}

		return null;
	};
	
	/**
	 * Ajoute un élément à l'élément courant
	 * @param Element elementHTML
	 * @param string position Position où ajouter l'élément
	 * 						  before, after, top ; si non renseigné, on ajoute l'élément à la fin du contenu
	 * @return self
	 */
	addElement(elementHTML, position) {
		
		var allowedPositions = [ null, 'before', 'after', 'top', 'bottom' ];
		position = (position || null);
		
		this._htmlElementRequired();
		
		if(allowedPositions.indexOf(position) === -1) {
			throw 'Position de l\'élément incorrect.';
		}
		
		switch(position) {
			case 'bottom': 
			case null:
				this.htmlElement.appendChild(elementHTML.htmlElement);
				break;
			case 'after':
				this.htmlElement.parentNode.insertBefore(elementHTML.htmlElement, this.htmlElement.nextSibling);
				break;
			case 'before':
				this.htmlElement.parentNode.insertBefore(elementHTML.htmlElement, this.htmlElement);
				break;
			case 'top':
				if(this.htmlElement.hasChildNodes()) {
					this.htmlElement.firstChild.parentNode.insertBefore(elementHTML.htmlElement, this.htmlElement.firstChild);
				} else {
					this.htmlElement.appendChild(elementHTML.htmlElement);
				}
		}
	
		return this;
		
	};
	
	/**
	 * Modifit la valeur d'une propriété de l'élément courant
	 * @param string property
	 * @param mixed value
	 * @return self
	 */
	setProperty(property, value) {
		
		this._htmlElementRequired();
		
		if(property == 'value' && this.tagName == 'input') {
			this.htmlElement.value = value;
		}
		
		if(property === 'text') {
			this.htmlElement.innerText = value;
		} else if(this.htmlElement[property] != undefined) {
			this.htmlElement[property] = value;
		} else {
			this.htmlElement.setAttribute(property, value);
		}
		
		this.attributes[property] = value;
		
		return this;
	};
	
	/**
	 * Retourne la valeur d'une propriété de l'élément courant
	 * @param string property
	 * @return mixed
	 */
	getProperty(property) {
		this._htmlElementRequired();
		
		var value = null;
		
		if(property === 'text') {
			value = this.htmlElement.innerText;
		} else if(property in this.htmlElement) {
			value = this.htmlElement[property];
		} else if(this.attributes.hasOwnProperty(property)) {
			value = this.attributes[property];
		}
		
		return value;
	};
	
	/**
	 * Ajoute une classe CSS à l'élément courant
	 * @param string className Classe à ajouter
	 * @return self
	 */
	addClass(className) {
		return this.addClasses([ className ]);
	}
	
	/**
	 * Ajoute plusieurs classes CSS à l'élément courant
	 * @param array classes Les classes à ajouter
	 * @return self
	 */
	addClasses(classes) {
		
		let self = this;
		
		classes.forEach(function(className) {
			className = className.trim();
			if(className != '') {
				self.htmlElement.classList.add(className);
			}
		});
		
		return this;
	};
	
	/**
	 * Retourne si la classe en paramètre existe pour l'élément
	 * @param string className
	 * @return bool
	 */
	hasClass(className) {
		return this.htmlElement.classList.contains(className);
	};
	
	/**
	 * Retourne les événements de l'objet du type d'événement en paramètre
	 * @param string event
	 * @return Object
	 */
	events(event) {
		
	
		var events = EventsRJS.listByElement[this.signature] || {};
		if(event) {
			events = (events[event] || []);
		}
		
		return events;
	};
	
	/**
	 * Ajoute un événement sur l'élèment courant
	 * @param string event Nom de l'événement à éxécuter
	 * @param function callback La méthode éxécutant l'événement à éxécuter
	 * @return self
	 */
	addEvent(event, callback) {
		
		this._htmlElementRequired();
		
		if(typeof callback !== 'function') {
			throw 'La méthode de l\'évenement est incorrecte.';
		}
		
		EventsRJS.add(this, event, callback);
		
		return this;
	};
	
	/**
	 * Déclenche un événement sur l'élément courant
	 * @param string Event event
	 * @param array Paramètres à transmettre à la méthode d'appel
	 * @return self
	 */
	fireEvent(event, params = []) {
		this._htmlElementRequired();
		EventsRJS.fire(this, event, params || []);
		return this;
	};
	
	/**
	 * Supprime la classe CSS de l'élément courant
	 * @patam string classToDelete
	 * @return self
	 */
	removeClass(classToDelete) {
		this._htmlElementRequired();
		this.htmlElement.classList.remove(classToDelete);
		this.setProperty('class', this.htmlElement.className);
		return this;
	};
	
	/**
	 * Suppression de l'élément courant 
	 * @return void
	 */
	remove() {
		this._htmlElementRequired();
		this.htmlElement.parentNode.removeChild(this.htmlElement);
	};
	
	/**
	 * Supprime un élément enfant de l'élément courant
	 * @param Element element l'élément à supprimer de l'élément courant
	 * @return self
	 */
	removeChild(element) {
		this._htmlElementRequired();
		element._htmlElementRequired();
		
		let firstParent = element.getParent();
		if(firstParent) {
			firstParent.htmlElement.removeChild(element.htmlElement);
		}

		return this;
	};
	
	/**
	 * Supprime tous les enfants de l'élément courant
	 * @return self
	 */
	removeChildren() {
		this._htmlElementRequired();
		while(this.htmlElement.firstChild) {
			this.removeChild(ElementRJS.retrieve(this.htmlElement.firstChild));
		}
		return this;
	};
	
	/**
	 * Retourne la valeur de l'offset de l'élément (offsetTop ou offsetLeft)
	 * @param string property top|left
	 * @return int
	 */
	computeOffset(property) {
	
		this._htmlElementRequired();
		
		let allowedProperties = [ 'top', 'left', ],
			element = this,
			offset = 0,
			htmlElementProperty = 'offset' + StringRJS.ucfirst(property)
		; 
		
		if(allowedProperties.indexOf(property) == -1) {
			throw 'Paramètre de computeOffset incorrect.';
		}
		
		do {
			offset += element.getProperty(htmlElementProperty);
			let offsetParent = element.getProperty('offsetParent');
			if(offsetParent) {
				element = ElementRJS.retrieve(offsetParent);
			} else {
				element = null;
			}
		} while(element);
		
		return offset;
	};
	
	/**
	 * Modifit les valeurs du défilement
	 * @param data : {
	 * 	top: <int>
	 * 	left: <int>
	 * }
	 * @return self
	 */
	changeScroll(data) {
		this._htmlElementRequired();
		
		let self = this,
			step = function(ratio) {
				[ 'left', 'top' ].forEach(function(property) {
					
					if(isNaN(data[property])) {
						return;
					}
					
					let scrollProperty = 'scroll' + StringRJS.ucfirst(property),
						currentScroll = self.getProperty(scrollProperty),
						stepScroll = currentScroll + (data[property] - currentScroll) * ratio
					;
					
					self.htmlElement[scrollProperty] = stepScroll;
	
				});
			}
		;
		
		new AnimationRJS(step, 500);
		
		return this;
	};
	
	/**
	 * Modification des styles
	 * @param object newStyles Objet JSON des styles à modifier
	 * @return self
	 */
	setStyles(newStyles) {
		this._htmlElementRequired();
		
		let styles = this.getProperty('style');
		
		Object.keys(newStyles).forEach(function(property) {
			let value = newStyles[property];
			styles.setProperty(property, value);
		});
		
		return this;
	};
	
	/**
	 * Retourne la valeur du style dont on donne la clé en paramètre
	 * @param string key
	 * @return string
	 */
	getStyle(key) {
		this._htmlElementRequired();
		return (window.getComputedStyle(this.htmlElement).getPropertyValue(key) || null);
	};
	
	/**
	 * Retourne la dimension de l'élément en pixel avec ses marges
	 * @param string property width|height
	 * @return float
	 */
	getOuterDimension(property) {
		this._htmlElementRequired();
		
		let self = this,
			dimension = 0,
			properties = {
				width: {
					left: 0,
					right: 0
				},
				height: {
					top: 0,
					bottom: 0
				}
			}
		; 
		
		if(Object.keys(properties).indexOf(property) == -1) {
			throw 'Paramètre de getOuterDimension incorrect.';
		}
		
		Object.keys(properties[property]).forEach(function(position) {
			let styleValue = self.getStyle('margin-' + StringRJS.ucfirst(position)) || 0;
			dimension += parseInt(StringRJS.replace(styleValue, {
				'px': ''
			}));
		});
		
		dimension += (this.getProperty('offset' + StringRJS.ucfirst(property)) || 0);
		
		return dimension;
	};
	
	/**
	 * Méthode appelée lorsque l'élément HTML n'a pas été appelé et qu'il est nécessaire
	 * @return void 
	 */
	_htmlElementRequired() {
		if(this.htmlElement === null) {
			throw 'L\'élément n\'a pas été initialisé.';
		}
	};
	
}
//# sourceMappingURL=maps/root.js.map
