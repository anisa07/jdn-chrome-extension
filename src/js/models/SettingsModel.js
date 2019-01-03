import { observable, action } from 'mobx';
import { JavaJDIUITemplate } from '../json/JavaJDIUITemplate';
import { JavaJDILightTemplate } from '../json/JavaJDILightTemplate';
import { saveAs } from "file-saver";

export default class SettingsModel {
	@observable downloadAfterGeneration = false;
	// @observable jdi = true;
	@observable extension = '';
	@observable framework = '';
	@observable template;

	constructor () {
		const settingsStorage = window.localStorage;

		this.downloadAfterGeneration = settingsStorage.getItem('DownloadAfterGeneration') === 'true';
		this.extension = settingsStorage.getItem('DefaultLanguage') || '.java';
		this.framework = settingsStorage.getItem('DefaultFramework') || 'jdiUI';

		if (this.extension === '.java' && this.framework === 'jdiUI') {
			const defaultTemplate = settingsStorage.getItem('DefaultTemplateJdiUI');
			if (defaultTemplate) {
				this.template = JSON.parse(defaultTemplate);
			} else {
				this.template = JavaJDIUITemplate;
				settingsStorage.setItem('DefaultTemplateJdiUI', JSON.stringify(JavaJDIUITemplate));
			}
		}

		if (this.extension === '.java' && this.framework === 'jdiLight') {
			const defaultTemplate = settingsStorage.getItem('DefaultTemplateJdiLight');
			if (defaultTemplate) {
				this.template = JSON.parse(defaultTemplate);
			} else {
				this.template = JavaJDILightTemplate;
				settingsStorage.setItem('DefaultTemplateJdiLight', JSON.stringify(JavaJDILightTemplate));
			}
		}
	}

	updateSiteImportSettings (name) {
		const rulesStorage = window.localStorage;
		rulesStorage.setItem(name, this.customSiteImports);
	}

	@action
	clearSiteStorage (nameToRemove, defaultSettings) {
		const settingsStorage = window.localStorage;
		settingsStorage.removeItem(nameToRemove);
		settingsStorage.setItem(name, defaultSettings);
	}

	@action
	triggerDownloadAfterGen () {
		this.downloadAfterGeneration = !this.downloadAfterGeneration;
		window.localStorage.setItem('DownloadAfterGeneration', this.downloadAfterGeneration.toString());
	}

	@action
	changeLanguage (lang) {
		this.extension = lang;

		window.localStorage.setItem('DefaultLanguage', this.extension);
	}

	@action
	changeFramework (frame) {
		this.framework = frame;

		window.localStorage.setItem('DefaultFramework', this.framework);
	}

	downloadCurrentTemplate () {
		let objToSave = {
			content: JSON.stringify(this.template),
			name: `${this.framework}Template.json`
		};
		if (objToSave.content && objToSave.name) {
			let blob = new Blob([objToSave.content], { type: "text/plain;charset=utf-8" });
			saveAs(blob, objToSave.name);
		}
	}
}
