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
			let url = new Url(options.url);
			
			sendData.forEach(function(value, key) {
				url.setQueryParam(key, value);
			});
			
			options.url = url.getHref();
		}

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

		this.request = request;
	};
	
	/**
	 * Exécute la requête
	 */
	execute() {
		return new Promise((resolve, reject) => {
			this.prepare();

			// Méthode en cas d'erreur
			this.request.onerror = () => {
				return reject(this.request.responseText);
			};

			// Méthode une fois l'appel terminé
			this.request.onload = () => {
				let status = this.request.status;
				if(status >= 200 && status < 300) {
					return resolve(this.onResponseSuccess(this.request.responseText));
				} else {
					return reject(this.onResponseError(this.request.responseText));
				}
			};

			this.request.send(this.sendData);
		});
	};
	
	/**
	 * Méthode à exécuter lorsque la requête échoue
	 * @param string response Réponse de la requête
	 * @return void
	 */
	onResponseError(response) {
		return response;
	};
	
	/**
	 * Méthode à exécuter lorsque la requête réussit
	 * @param string response Réponse de la requête
	 */
	onResponseSuccess(response) {
		return response;
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

		this.onValidJsonCallback = (json) => json;
		this.onInvalidJsonCallback = () => null;

		this.sendJsonBody = options.sendJsonBody || false;
		if(this.sendJsonBody) {
			this.sendData = JSON.stringify(Object.fromEntries(this.sendData));
		}
	};
	 
	/**
	 * Gestion des fonctions d'appel lorsque 
	 */
	onJsonResponse(response) {
	
		try {
			let jsonData = JSON.parse(response);
			return this.onValidJsonCallback(jsonData);
		} catch(e) {
			return this.onInvalidJsonCallback(response);
		}
		
	};
	
	/**
	 * Méthode à exécuter lorsque la requête échoue
	 * @param string response Réponse de la requête
	 * @return void
	 */
	onResponseError(response) {
		return this.onJsonResponse(response);
	};
	
	/**
	 * Méthode à exécuter lorsque la requête réussit
	 * @param string response Réponse de la requête
	 * @return void
	 */
	onResponseSuccess(response) {
		return this.onJsonResponse(response);
	};
	
};

/**
 * Classe gérant l'appel Ajax pour le téléchargement d'un fichier
 */
export class UploadAjaxRequest extends JsonAjaxRequest {
	
	// onProgress: null

	constructor(options) {
		options.method = "post";
		super(options);
		
		// Méthode à exécuter pendant du téléchargement du fichier
		this.onProgress = (response) => {
			if(typeof options.onProgress === "function") {
				options.onProgress(response);
			}
		};
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
