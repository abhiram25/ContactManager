import {UI} from "./ui.js";
import {TemplateManager} from './templateManager.js';

export class FormHandler {
	constructor()	{
		this.contactForm = document.querySelector('#contactForm');
		this.templateManager = new TemplateManager;
	}

	createNewContactForm() {
		const tags = ['Work', 'Friend', 'Marketing', 'Finance', 'Fitness'];		
		this.contactForm.setAttribute('id', 'newContactForm');
		this.contactForm.innerHTML = this.templateManager.newContactTemplate({'tags': tags});		
	}

	updateEditForm() {
		let request = new XMLHttpRequest();
		let id = event.target.parentNode.id;
		this.contactForm.setAttribute('id', 'editContactForm');
		this.contactForm.setAttribute('action', `/api/contacts/${event.target.parentNode.id}`);		
		
		request.addEventListener('load', () => {
			this.contactForm.innerHTML = this.templateManager.editContactTemplate(request.response);
		})

		request.open('GET', `/api/contacts/${id}`);
		request.responseType = 'json';
		request.send();
	}
		
	generateData() {		
		let data = {};
		let tags = [];				
		[...this.contactForm.querySelectorAll('[name]')].forEach(node => {
			if (node.nodeName === 'SELECT') {
				tags = data[node.name] = [...node.querySelectorAll('option')].map(({value, selected}) => {
					if (selected) {
						return {
							"tag": `${value}`,
							"selected": true,
						}
					} else {
						return {
							"tag": `${value}`,
							"selected": false,
						}
					}
				})
			} else {
				data[node.name] = node.value;
			}
		})
				
		return data;
	}	

	invalidForm() {
		let requiredInputs = this.contactForm.querySelectorAll('input[name]');
		return [...requiredInputs].filter(({value}) => {
			return !value.trim() 
		})			
	}

	removeErrors() {
		[...this.contactForm.querySelectorAll('input[name]')].forEach(({parentNode, style}) => {
			parentNode.style.color = '#222';
			parentNode.nextElementSibling.style.display = 'none';
			style.borderColor = '#FFFFFF';
		})
	}

	validateForm() {
		let blankInputs = this.invalidForm();
			
		blankInputs.forEach(node => {
			node.parentNode.style.color = 'red'
			node.style.borderColor = 'red';
			node.parentNode.nextElementSibling.style.display = 'block';
		})
	}			
}