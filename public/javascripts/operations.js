import {UI} from './ui.js';
import {FormHandler} from './form_handler.js';

export class Operations {
  constructor() {
    this.ui = new UI;
    this.formHandler = new FormHandler;
  }

  handleRequest(request) {
    request.addEventListener('load', () => {
      if (request.status === 201) {
        this.ui.resetSearchAndDisplay()
      }
    });    
  }

  add() { 
    let data = JSON.stringify(this.formHandler.generateData(this.formHandler.contactForm));
    let newContactRequest = new XMLHttpRequest();    
    let blankInputs = this.formHandler.invalidForm().length;

    if (!blankInputs) {
      newContactRequest.open('POST', '/api/contacts');
      newContactRequest.setRequestHeader('Content-Type', 'application/json');
      newContactRequest.send(data);
    } else {
      this.formHandler.validateForm()
    }          
    
    this.handleRequest(newContactRequest);
  }
  
  edit() {
    let data = JSON.stringify(this.formHandler.generateData(this.formHandler.contactForm));
    let editRequest = new XMLHttpRequest();
    let blankInputs = this.formHandler.invalidForm().length;

    if (!blankInputs) {
      editRequest.open('PUT', `${this.formHandler.contactForm.getAttribute('action')}`);
      editRequest.setRequestHeader('Content-Type', 'application/json');
      editRequest.send(data);
    } else {
      this.formHandler.validateForm()
    }    
      
    this.handleRequest(editRequest);
  }
  
  delete() {
    let deleteRequest = new XMLHttpRequest();
    let id = event.target.parentNode.id;
    let confirmation = confirm("Are you sure you want to delete");
    
    deleteRequest.addEventListener('load', () => {
      this.ui.displayContactList();    
    });

    if (confirmation) {
      deleteRequest.open('DELETE', `/api/contacts/${id}`);
      deleteRequest.responseType = 'json';
      deleteRequest.send();
    } else {
      return;
    }
  }  
}