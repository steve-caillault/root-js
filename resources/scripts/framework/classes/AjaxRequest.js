/**
 * Classe gérant un appel Ajax
 */

import Url from "Classes/Url";

export class AjaxRequest {
	
	// request: null,
	// method: null
	// url: null
	// headers: {}
	// sendData: null
	// onError: null
	// onSuccess: null
	// onComplete: null
	// onProgress: null
	
	constructor(options) {

		options = options || {};
		
		
		let self = this,
			// Récupération de la méthode HTTP
			method = (options.method || "get").toLowerCase(),
			allowedMethods = [ "get", "post" ],
			// En-têtes
			headers = options.headers || {},
			// Récupération des paramètres à transmettre
			params = options.params || {},
			sendData = new FormData()
		;

		headers["X-Requested-With"] = "XMLHttpRequest";
	
		// Validation de la méthode HTTP
		if(allowedMethods.indexOf(method) === -1) {
			throw "Méthode HTTP interdite.";
		}
		
		// Validation de l'URL de la requête
		if(! options.url) {
			throw "L'URL de l'appel Ajax est manquant.";
		}

		// Construction des paramètres à transmettre
		if(params instanceof FormData) {
			sendData = params;
		} else {
			for(var index in params) {
				sendData.append(index, params[index]);
			}
		}
		
		if(method == "get") {
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
				if(options[type] && typeof options[type] === "function") {
					options[type](response);
				}
			};
		};
		
		// Méthode à éxécuter une fois l'appel terminé
		initCallback("onComplete");
		// Méthode à exécuter en cas de succès
		initCallback("onSuccess");
		// Méthode à éxécuter en cas d'échec
		initCallback("onError");
		// Méthode à éxécuter lors du téléchargement du fichier
		initCallback("onProgress");

		this.method = method.toUpperCase();
		this.url = options.url;
		this.headers = headers;
		this.sendData = sendData;
		this.request = null;
	};

	/**
	 * Prépare la requête XHR pour l'envoi
	 * @return void
	 */
	prepare() {
		if(this.request !== null) {
			return;
		}

		let self = this,
			request = new XMLHttpRequest()
		;

		request.open(this.method, this.url);

		// Ajout des en-têtes
		Object.keys(this.headers).forEach((headerKey) => {
			request.setRequestHeader(headerKey, this.headers[headerKey]);
		});

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

		this.request = request;
	};
	
	/**
	 * Exécute la requête
	 */
	execute() {
		this.prepare();
		this.request.send(this.sendData);
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
	
	// sendJsonBody: false, // Vrai si la requête doit envoyer les paramètres dans une chaine JSON
	// onValidJsonCallback: null,
	// onInvalidJsonCallback: null,

	constructor(options) {

		super(options);

		this.sendJsonBody = options.sendJsonBody || false;
		this.sendData = JSON.stringify(Object.fromEntries(this.sendData));
	};
	 
	/**
	 * Gestion des fonctions d'appel lorsque 
	 */
	onJsonResponse(response) {
	
		try {
			let jsonData = JSON.parse(response);
			this.onValidJsonCallback(jsonData);
		} catch(e) {
			this.onInvalidJsonCallback(response);
			return;
		}
		
	};
	
	/**
	 * Méthode à exécuter lorsque la requête échoue
	 * @param string response Réponse de la requête
	 * @return void
	 */
	onResponseError(response) {
	
		let self = this;
	
		this.onValidJsonCallback = (json) => {
			this.onError(json);
		};
		
		this.onInvalidJsonCallback = () => {
			this.onError(null);
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
		
		this.onValidJsonCallback = (json) => {
			self.onSuccess(json)
		};
		
		this.onInvalidJsonCallback = () => {
			self.onError(null);
		};
		
		this.onJsonResponse(response);
	};
	
};

/**
 * Classe gérant l'appel Ajax pour le téléchargement d'un fichier
 */
export class UploadAjaxRequest extends JsonAjaxRequest {
	
	constructor(options) {
		options.method = "post";
		super(options);
		
	};
	
	/**
	 * Prépare la requête XHR pour l'envoi
	 * @return void
	 */
	prepare() {
		if(this.request !== null) {
			return;
		}

		super.prepare();

		// Progression du téléchargement
		this.request.upload.onprogress = (event) => {
			this.onProgress(event);
		};
		
	}
	
};
