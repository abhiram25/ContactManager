export class TemplateManager {
	constructor() {
		this.generateTemplates();
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

	generateTemplates() {
		[...document.querySelectorAll('script[type="text/x-handlerbars"]')].forEach(({id}) => {
			this[id] = Handlebars.compile(document.querySelector(`#${id}`).innerHTML);
		})
	}

	init() {
		this.registerHelpers();
	}		
}