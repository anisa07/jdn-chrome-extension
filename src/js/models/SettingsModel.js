import { observable, action } from 'mobx';
import { JavaJDIUITemplate } from '../json/JavaJDIUITemplate';

export default class SettingsModel {
	@observable downloadAfterGeneration = false;
	@observable jdi = true;
	@observable extension = '';
	@observable framework = '';
	@observable template;

	constructor () {
		const settingsStorage = window.localStorage;

		this.downloadAfterGeneration = settingsStorage.getItem('DownloadAfterGeneration') === 'true';
		this.extension = settingsStorage.getItem('DefaultLanguage') || '.java';
		this.framework = settingsStorage.getItem('DefaultFramework') || 'jdiUI';

		if (this.extension === '.java' && this.framework === 'jdiUI') {
			const defaultTemplate = settingsStorage.getItem('DefaultTemplate');
			if (defaultTemplate) {
				this.template = JSON.parse(defaultTemplate);
			} else {
				this.template = JavaJDIUITemplate;
				settingsStorage.setItem('DefaultTemplate', JSON.stringify(JavaJDIUITemplate));
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
}
