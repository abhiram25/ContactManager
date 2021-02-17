import {TemplateManager} from './templateManager.js';
import {FormHandler} from './form_handler.js';
import {TagManager} from './TagManager.js'
import {tags} from './TagManager.js';

export class UI {
	constructor() {
		this.noContactsResult = document.querySelector('#noContactsResults');
		this.searchBox = document.querySelector('#searchBox');
		this.templateManager = new TemplateManager;
		this.formHandler = new FormHandler;
		this.section = document.querySelector('section');
		this.tagManager = new TagManager;
	}

	getValue() {
		return this.searchBox.value;
	}	

	showForm() {
		let $section = $('section');
		let $form = $('form');
		$section.slideUp()
		$form.show()
		document.body.insertBefore($section[0], this.formHandler.form);
	}

	resetSearch() {
		this.searchBox.value = '';
  	this.noContactsResult.style.display = 'none';
  }

	displayNoContactTemplate() {
		return this.templateManager.noContactTemplate();
	}

	generateContacts(contacts) {
		let $section = $('section');
		let $form = $('form');

		contactBox.innerHTML = this.templateManager.contactTemplate({'contacts': contacts});
		document.body.insertBefore(this.formHandler.form, this.section);
		$form.slideUp()
		$section.show()								
	}

	resetSearchAndDisplay() {
    this.resetSearch();
    this.displayContactList();		
	}

  addNewTagToForms() {
    let value = this.tagManager.getNewTag();

    if (value) {
      tags.push(value);
      this.resetSearchAndDisplay()
    } else {
      this.formHandler.validateForm();
    }
  }

	displayContactList() {
		let contactRequest = new XMLHttpRequest();

		contactRequest.addEventListener('load', () => {
			let contacts = contactRequest.response;
			let contactBox = document.querySelector('#noContactBox') || document.querySelector('#contactBox')
			let filteredContacts;
			let length;
			let key = this.getValue();	

			if (contactBox.id === 'noContactBox' && contacts.length > 0) {
				contactBox.setAttribute('id', 'contactBox');
				this.generateContacts(contacts);
			} else if (contactBox.id === 'noContactBox' && contacts.length === 0){		
				contactBox.innerHTML = this.templateManager.noContactTemplate();					
			} else if (contactBox && contacts.length > 0) {
				this.generateContacts(contacts);					
			} else {
				contactBox.innerHTML = this.displayNoContactTemplate();
				contactBox.setAttribute('id', 'noContactBox');
			}

			if (!key) {
				contactBox.style.display = 'block';
			} else if (key) {
				filteredContacts = contacts.filter(({full_name}) => { 
					return full_name.toUpperCase().startsWith(key.toUpperCase());
				})

				length = filteredContacts.length;

				if (length > 0) {
					contactBox.innerHTML = this.ui.contactTemplate({'contacts': filteredContacts});
				} else {
					contactBox.style.display = 'none';
					noContactsResults.style.display = 'block';
					noContactsResults.innerHTML = this.templateManager.noContactResultsTemplate({'letter': key});
				}	
			}
		});	

		contactRequest.open('GET', '/api/contacts');
		contactRequest.responseType = 'json';
		contactRequest.send();
	}	

	showSection() {
		this.noContactsResult.display = 'none';			
		let $section = $('section');
		let $form = $('form');

		document.body.insertBefore(this.formHandler.form, $section[0]);
		$form.slideUp()
		$section.show()
	}
}