import {UI} from "./ui.js";
import {FormHandler} from './form_handler.js';
import {TemplateManager} from './templateManager.js';
import {Operations} from './operations.js';

export class EventManager {
	constructor() {
		this.formHandler = new FormHandler;
		this.ui = new UI;
		this.operations = new Operations;
		this.templateManager = new TemplateManager;
	}

	bindEvents() {		
		document.addEventListener('click', event => {
			if (event.target.textContent === 'Delete') {
				this.operations.delete();
			} else if (event.target.className === 'addContact' || event.target.className === 'editContact') {
				if (event.target.className === 'editContact') {
					this.formHandler.updateEditForm()			
				} else if (event.target.className === 'addContact') {
					this.formHandler.createNewContactForm();	
			}
				this.ui.showContactForm()
			} else if (event.target.className === 'cancelButton') {
				this.ui.showSection();
			}
		})

		this.ui.searchBox.addEventListener('keydown', event => {
			this.ui.displayContactList()
		})

		document.addEventListener('submit', event => {
			event.preventDefault();
			this.formHandler.removeErrors();
			if (event.target.id === 'newContactForm') {
				this.operations.add();
			} else if (event.target.id === 'editContactForm') {
				this.operations.edit();
			}
		})
	}	
}