import {UI} from "./ui.js";
import {TemplateManager} from "./templateManager.js";
import {EventManager} from "./eventManager.js";

document.addEventListener('DOMContentLoaded', () => {	
	class ContactManager {
		constructor() {
			this.ui = new UI;
			this.templateManager = new TemplateManager;
			this.eventManager = new EventManager;
		}

		init() {
			this.ui.displayContactList();
			this.templateManager.init();
			this.eventManager.bindEvents();
		}
	}

	let contactManager = new ContactManager;

	contactManager.init();
});