/**
 * Gestion d'URL ou de pseudo URL
 */
 
export default class Url {
	
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
		
		let indexSeparator = this.url.indexOf("?");
		
		if(indexSeparator != -1) {
			this.baseUrl = this.baseUrl.substring(0, indexSeparator);
		}
	};
	
	/**
	 * Initialise les paramètres en GET
	 * @return void
	 */
	initQueries() {
		
		let indexSeparator = this.url.indexOf("?"),
			queryString = ""
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
			url += "?" + this.queries.toString();
			
		}
		
		return url;
	};
	
}