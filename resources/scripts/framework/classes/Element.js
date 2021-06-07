/**
 * Gestions des événements
 */

import Str from "Classes/Str";
import Animation from "Classes/Animation";

let EventsRJS = {
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
	 * @param Element element Elément sur lequel déclencher l'événement
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
export default class Element {
	
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
			this.htmlElement.rjsSignature = Str.uniqueId();
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
		return Element.retrieve(htmlElement);
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
			elements.push(Element.retrieve(element));
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
				return Element.retrieve(element);
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
				return Element.retrieve(element);
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
            	return Element.retrieve(parent);
            }
            parent = parent.parentElement /*|| parent.parentNode*/;
            if(! selector && parent) {
            	return Element.retrieve(parent);
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
		return Element.searchOne(selector, this);
	};
	
	/**
	 * Recherche les enfants de l'élément courant
	 * @param string selector
	 * @return self
	 */
	getChildren(selector) {
		this._htmlElementRequired();
		return Element.searchList(selector, this); 
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
			this.removeChild(Element.retrieve(this.htmlElement.firstChild));
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
			htmlElementProperty = 'offset' + Str.ucfirst(property)
		; 
		
		if(allowedProperties.indexOf(property) == -1) {
			throw 'Paramètre de computeOffset incorrect.';
		}
		
		do {
			offset += element.getProperty(htmlElementProperty);
			let offsetParent = element.getProperty('offsetParent');
			if(offsetParent) {
				element = Element.retrieve(offsetParent);
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
					
					let scrollProperty = 'scroll' + Str.ucfirst(property),
						currentScroll = self.getProperty(scrollProperty),
						stepScroll = currentScroll + (data[property] - currentScroll) * ratio
					;
					
					self.htmlElement[scrollProperty] = stepScroll;
	
				});
			}
		;
		
		new Animation(step, 500);
		
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
			let styleValue = self.getStyle('margin-' + Str.ucfirst(position)) || 0;
			dimension += parseInt(Str.replace(styleValue, {
				'px': ''
			}));
		});
		
		dimension += (this.getProperty('offset' + Str.ucfirst(property)) || 0);
		
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
	
};