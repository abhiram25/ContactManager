import {TemplateManager} from './templateManager.js';
import {TagManager} from './tagManager.js';
import {tags} from './TagManager.js';

export class FormHandler {
	constructor()	{
		this.form = document.querySelector('form');
		this.newTagForm = document.querySelector('#newTagForm');
		this.templateManager = new TemplateManager;
		this.tagManager = new TagManager;
	}

	createNewContactForm() {
		this.form.setAttribute('id', 'newContactForm');
		this.form.innerHTML = this.templateManager.newContactTemplate({'tags': tags});		
	}

	createNewTagForm() {
		this.form.setAttribute('id', 'newTagForm');
		this.form.innerHTML = this.templateManager.newTagTemplate();	
	}

  addNewTagOption() {
  	let selectTagInput = document.querySelector('select');
  	let tag = this.tagManager.newTag;
  	let option = document.createElement('option');
  	option.textContent = tags[tags.length-1];
  	selectTagInput.appendChild(option);
  }  	

	updateEditForm() {
		let request = new XMLHttpRequest();
		let id = event.target.parentNode.id;
		this.form.setAttribute('id', 'editContactForm');
		this.form.setAttribute('action', `/api/contacts/${event.target.parentNode.id}`);		
		
		request.addEventListener('load', () => {
			this.form.innerHTML = this.templateManager.editContactTemplate(request.response);
			this.addNewTagOption()	
		})

		request.open('GET', `/api/contacts/${id}`);
		request.responseType = 'json';
		request.send();
	}
		
	generateData() {		
		let data = {};
		let tags = [];				
		[...this.form.querySelectorAll('[name]')].forEach(node => {
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
		let requiredInputs = this.form.querySelectorAll('input[name]');
		return [...requiredInputs].filter(({value}) => {
			return !value.trim() 
		})			
	}

	removeErrors() {
		[...this.form.querySelectorAll('input[name]')].forEach(({parentNode, style}) => {
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