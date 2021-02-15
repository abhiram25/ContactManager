document.addEventListener('DOMContentLoaded', () => {	
	class ContactManager {
		constructor() {
			this.contactTemplate = Handlebars.compile(document.querySelector('#contactTemplate').innerHTML);
			this.noContactTemplate = Handlebars.compile(document.querySelector('#noContactTemplate').innerHTML);
			this.editContactTemplate = Handlebars.compile(document.querySelector('#editContactTemplate').innerHTML);
			this.newContactTemplate = Handlebars.compile(document.querySelector('#newContactTemplate').innerHTML);
			this.noContactResultsTemplate = Handlebars.compile(document.querySelector('#noContactResultsTemplate').innerHTML);
			this.noContactsResult = document.querySelector('#noContactsResults');
			this.contactForm = document.querySelector('#contactForm');
			this.searchBox = document.querySelector('#searchBox');
		}

		registerHelpers() {
			Handlebars.registerHelper('filteredTags', function(data) {
				let filteredData = data.filter(({selected}) => {
					return selected;
				})

				if (filteredData.length > 0) {
					return filteredData.map(({tag}) => { return tag });
				} else {
					return "None";
				}
			});					
		}

		displayContactList() {
			let contactRequest = new XMLHttpRequest();

			contactRequest.addEventListener('load', () => {
				let contacts = contactRequest.response;
				let contactBox = document.querySelector('#noContactBox') || document.querySelector('#contactBox')
				let $section = $('section');
				let filteredContacts;
				let length;
				let $contactForm;
				let key = this.searchBox.value;		

				if ($('#contactForm').length > 0) {
					$contactForm = $('#contactForm');
				} else if ($('#newContactForm').length > 0) {
					$contactForm = $('#newContactForm');
				} else {
					$contactForm = $('#editContactForm');
				}

				if (contactBox.id === 'noContactBox' && contacts.length > 0) {
					contactBox.setAttribute('id', 'contactBox');
					contactBox.innerHTML = this.contactTemplate({'contacts': contacts});
					document.body.insertBefore($contactForm[0], $section[0]);
					$contactForm.slideUp()
					$section.show()
				} else if (contactBox.id === 'noContactBox' && contacts.length === 0){		
					contactBox.innerHTML = this.noContactTemplate();					
				} else if (contactBox && contacts.length > 0) {
					contactBox.innerHTML = this.contactTemplate({'contacts': contacts});
					document.body.insertBefore($contactForm[0], $section[0]);
					$contactForm.slideUp()
					$section.show()						
				} else {
					contactBox.innerHTML = this.noContactTemplate();	
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
						contactBox.innerHTML = this.contactTemplate({'contacts': filteredContacts});
					} else {
						contactBox.style.display = 'none';
						noContactsResults.style.display = 'block';
						noContactsResults.innerHTML = this.noContactResultsTemplate({'letter': key});
					}	
				}
			});	

			contactRequest.open('GET', '/api/contacts');
			contactRequest.responseType = 'json';
			contactRequest.send();
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

		add() {	
			let form = this.contactForm;
			let data = JSON.stringify(this.generateData(form));
			let blankInputs = this.invalidForm().length;			

			let newContactRequest = new XMLHttpRequest();
			newContactRequest.addEventListener('load', () => {
				if (newContactRequest.status === 201) {
					this.searchBox.value = '';
					this.noContactsResult.style.display = 'none';
					this.displayContactList()
				}
			});

			if (!blankInputs) {
				newContactRequest.open('POST', '/api/contacts');
				newContactRequest.setRequestHeader('Content-Type', 'application/json');
				newContactRequest.send(data);
			} else {
				this.validateForm()
			}
		}

		edit() {
			let form = event.target;
			let data = JSON.stringify(this.generateData(form));
			let editRequest = new XMLHttpRequest();
			editRequest.addEventListener('load', () => {
				this.displayContactList()
			});

			editRequest.open('PUT', `${form.getAttribute('action')}`);
			editRequest.setRequestHeader('Content-Type', 'application/json');
			editRequest.send(data);
		}

		updateEditForm() {
			let request = new XMLHttpRequest();
			let id = event.target.parentNode.id;
			request.addEventListener('load', () => {
				this.contactForm.innerHTML = this.editContactTemplate(request.response);
			})

			request.open('GET', `/api/contacts/${id}`);
			request.responseType = 'json';
			request.send();
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
				parentNode.nextElementSibling.style.display = 'node';
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

		delete() {
			let deleteRequest = new XMLHttpRequest();
			let id = event.target.parentNode.id;
			deleteRequest.addEventListener('load', () => {
				this.displayContactList();
			});

			deleteRequest.open('DELETE', `/api/contacts/${id}`);
			deleteRequest.responseType = 'json';
			deleteRequest.send();
		}

		bindEvents() {
			let $section = $('section');
			let $contactForm = $('#contactForm');			

			document.addEventListener('click', event => {
				const tags = ['Work', 'Friend', 'Marketing', 'Finance', 'Fitness'];
				if (event.target.textContent === 'Delete') {
					this.delete(event.target.parentNode.id);
				} else if (event.target.className === 'addContact' || event.target.className === 'editContact') {
					if (event.target.className === 'editContact') {
						this.contactForm.setAttribute('id', 'editContactForm');
						this.contactForm.setAttribute('action', `/api/contacts/${event.target.parentNode.id}`);
						this.updateEditForm()			
					} else if (event.target.className === 'addContact') {
						this.contactForm.setAttribute('id', 'newContactForm');
						this.contactForm.innerHTML = this.newContactTemplate({'tags': tags});	
					}				
					$section.slideUp()
					$contactForm.show()
					document.body.insertBefore($section[0], $contactForm[0]);
				} else if (event.target.className === 'cancelButton') {
					document.body.insertBefore($contactForm[0], $section[0]);
					$contactForm.slideUp()
					$section.show()
				}
			})

			this.searchBox.addEventListener('keydown', event => {
				this.displayContactList()
			})

			document.addEventListener('submit', event => {
				event.preventDefault();
				this.removeErrors();
				if (event.target.id === 'newContactForm') {
					this.add();
				} else if (event.target.id === 'editContactForm') {
					this.edit();
				}
			})
		}

		init() {
			this.displayContactList();
			this.registerHelpers();
			this.bindEvents();
		}
	}

	let contactManager = new ContactManager;

	contactManager.init();
});