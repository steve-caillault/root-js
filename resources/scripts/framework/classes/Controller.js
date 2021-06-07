
/**
 * Contrôleur RootJS
 */

export default class Controller {
	
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

