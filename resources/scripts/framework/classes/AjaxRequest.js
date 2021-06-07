/**
 * Classe gérant un appel Ajax
 */

import Url from "Classes/Url";

export class AjaxRequest {
	
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
			let url = new Url(options.url),
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
export class JsonAjaxRequest extends AjaxRequest {
	
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
export class UploadAjaxRequest extends JsonAjaxRequest {
	
	// isUpload: true
	
	constructor(options) {
		options.isUpload = true;
		options.method = 'post';
		super(options);
		
	};
	
};
