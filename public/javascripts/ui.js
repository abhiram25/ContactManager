import {TemplateManager} from './templateManager.js';
import {FormHandler} from './form_handler.js';

export class UI {
	constructor() {
		this.noContactsResult = document.querySelector('#noContactsResults');
		this.searchBox = document.querySelector('#searchBox');
		this.templateManager = new TemplateManager;
		this.formHandler = new FormHandler;
		this.section = document.querySelector('section');
	}

	getValue() {
		return this.searchBox.value;
	}	

	showContactForm() {
		let $section = $('section');
		let $contactForm;

		if ($('#newContactForm').length > 0) {
			$contactForm = $('#newContactForm');
		} else if ($('#editContactForm').length > 0) {
			$contactForm = $('#editContactForm');
		} else {
			$contactForm = $('#contactForm');
		}						
		$section.slideUp()
		$contactForm.show()
		document.body.insertBefore($section[0], $contactForm[0]);
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
		let $contactForm;				

		if ($('#contactForm').length > 0) {
			$contactForm = $('#contactForm');
		} else if ($('#newContactForm').length > 0) {
			$contactForm = $('#newContactForm');
		} else {
			$contactForm = $('#editContactForm');
		}		

		contactBox.innerHTML = this.templateManager.contactTemplate({'contacts': contacts});
		document.body.insertBefore(this.formHandler.contactForm, this.section);
		$contactForm.slideUp()
		$section.show()								
	}

	resetSearchAndDisplay() {
    this.resetSearch();
    this.displayContactList();		
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
		let $contactForm;

		if ($('#newContactForm').length > 0) {
			$contactForm = $('#newContactForm');
		} else if ($('#editContactForm').length > 0) {
			$contactForm = $('#editContactForm');
		}
		document.body.insertBefore($contactForm[0], $section[0]);
		$contactForm.slideUp()
		$section.show()
	}
}