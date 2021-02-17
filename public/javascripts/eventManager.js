import {UI} from "./ui.js";
import {FormHandler} from './form_handler.js';
import {TemplateManager} from './templateManager.js';
import {Operations} from './operations.js';
import {TagManager} from './tagManager.js';

export class EventManager {
	constructor() {
		this.formHandler = new FormHandler;
		this.ui = new UI;
		this.operations = new Operations;
		this.templateManager = new TemplateManager;
		this.tagManager = new TagManager;
	}

	bindEvents() {
		document.addEventListener('click', event => {
			if (event.target.textContent === 'Delete') {
				this.operations.delete();
			} else if (event.target.className === 'addContact' || event.target.className === 'editContact' || 
								 event.target.id === 'addTag') {
				if (event.target.className === 'editContact') {
					this.formHandler.updateEditForm()		
				} else if (event.target.className === 'addContact') {
					this.formHandler.createNewContactForm();	
				} else if (event.target.id === 'addTag') {
					this.formHandler.createNewTagForm();
				}
				this.ui.showForm()
			} else if (event.target.className === 'cancelButton') {
				this.ui.showSection();
			} else if (event.target.id === 'addTag') {
				this.formHandler.createNewTagForm();
			}
		})

		this.ui.searchBox.addEventListener('keydown', event => {
			this.ui.displayContactList()
		})

		this.formHandler.form.addEventListener('submit', event => {
			event.preventDefault();
			this.formHandler.removeErrors();
			if (event.target.id === 'newContactForm') {
				this.operations.addContact();
			} else if (event.target.id === 'editContactForm') {
				this.operations.edit();
			} else if (event.target.id ==='newTagForm') {
				this.ui.addNewTagToForms();
			}
		})
	}	
}