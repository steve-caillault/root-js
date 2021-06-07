/**
 * Gestion d'une animation sur un élément HTML
 */
export default class Animation {
	
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