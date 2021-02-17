import {TemplateManager} from './templateManager.js';

export let tags = ['Work', 'Family', 'Friends']

export class TagManager {
	constructor() {
		this.newTag;
	}
	getNewTag() {
		let newTagInput = document.querySelector('input[name="new_tag"]');
		return newTagInput.value;
	}

}