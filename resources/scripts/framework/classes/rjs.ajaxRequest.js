/**
 * Classe gérant un appel Ajax
 */
class AjaxRequestRJS {
	
	// method: null
	// url: null
	// queryString: null
	// onError: null
	// onSuccess: null
	// onComplete: null
	// onProgress: null
	
	constructor(options) {

		options = options || {};
		
		// Récupération de la méthode HTTP
		var self = this,
			method = (options.method || 'get').toLowerCase(),
			allowedMethods = [ 'get', 'post' ],
			// Récupération des paramètres à transmettre
			params = options.params || [],
			queryString = '',
			requestParams = [];
		
		// Validation de la méthode HTTP
		if(allowedMethods.indexOf(method) === -1) {
			throw 'Méthode HTTP interdite.';
		}
		
		// Validation de l'URL de la requête
		if(! options.url) {
			throw 'L\'URL de l\'appel Ajax est manquant.';
		}
		
		// Construction de la chaine des paramètres à transmettre
		for(var index in params) {
			requestParams.push(encodeURI(index + '=' + params[index]));
		}
		if(requestParams.length > 0) {
			queryString = requestParams.join('&');
			
			if(method == 'get') {
				let separatorParams = (options.url.indexOf('?') != -1) ? '&' : '?';
				options.url += separatorParams + queryString;
			}
		}
		
		// Méthode d'initialisation des méthodes de retour
		var initCallback = function(type) {
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
		this.queryString = queryString;
		this.isUpload = (options.isUpload || false);
		
		this.execute();
	};
	
	/**
	 * Exécute la requête
	 */
	execute() {
		
		var self = this,
			request = new XMLHttpRequest(),
			queryString = (this.method == 'get') ? null : this.queryString
		;
		
		request.open(this.method, this.url);
		
		request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		
		// En-tête pour une requête POST
		if(this.method == 'POST') {
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		
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
			if(this.status === 200) {
				self.onResponseSuccess(this.responseText);
			} else {
				self.onError(this.responseText);
			}
		};

		// Envoi de la requête
		request.send(queryString);
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
	
	onResponseSuccess(response) {
		
		var jsonData = {};
		try {
			jsonData = JSON.parse(response);
		} catch(e) {
			this.onError(null);
		}
	
		this.onSuccess(jsonData);
		
	}
	
};

/**
 * Classe gérant l'appel Ajax pour le téléchargement d'un fichier
 */
class UploadAjaxRequestRJS extends JsonAjaxRequestRJS {
	
	// isUpload: true
	
	constructor(options) {
		options.isUpload = true;
		super(options);
		
	};
	
};
