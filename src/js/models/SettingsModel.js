import { observable, action } from 'mobx';
import RulesJson from "../json/rules";

export default class SettingsModel {
	@observable downloadAfterGeneration = false;
	@observable extension = '.java';

	@observable defaultSiteImports = `
import com.epam.jdi.uitests.web.selenium.elements.composite.WebSite;
import com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.*;
`;
	@observable customSiteImports = this.defaultSiteImports;
	@observable siteImportsStorageName = '';

	@observable defaultCommonImports = `
import com.epam.jdi.uitests.web.selenium.elements.common.*;
import com.epam.jdi.uitests.web.selenium.elements.complex.*;
import com.epam.jdi.uitests.web.selenium.elements.composite.*;
import com.epam.jdi.uitests.web.selenium.elements.composite.WebPage;
import com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.objects.*;
import com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.simple.*;
import com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.FindBy;`;

	constructor () {
		this.siteImportsStorageName = `${this.extension.substring(1)}SiteImports`;
		const settingsStorage = window.localStorage;
		const siteImportsSettings = settingsStorage.getItem(this.siteImportsStorageName);

		if (siteImportsSettings) {
			this.defaultSiteImports = siteImportsSettings;
			this.customSiteImports = siteImportsSettings;
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
}
