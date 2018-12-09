import { observable, action } from 'mobx';
import { saveAs } from 'file-saver';
import JSZip from '../jszip/dist/jszip';

export default class ConversionToCodeModel {
	@observable language = 'java';
	@observable currentPageCode;
	@observable siteCodeReady = false;
	@observable generatedPages = [];

	@action
	genPageCode (page, mainModel) {
		const { generateBlockModel } = mainModel;
		this.currentPageCode = generateBlockModel.jdi ? pageCode(page, mainModel) : seleniumPageCode(page);
		this.generatedPages.push(this.currentPageCode);
	}

	@action
	setCurrentPageCode(index) {
		this.currentPageCode = this.generatedPages[index];
	}

	downloadPageCode (page, extension) {
		let objToSave = {
			content: this.currentPageCode,
			name: getPageName(page.name) + extension
		};
		if (objToSave.content && objToSave.name) {
			let blob = new Blob([objToSave.content], { type: "text/plain;charset=utf-8" });
			saveAs(blob, objToSave.name);
		}
	}

	zipAllCode (mainModel) {
		let zip = new JSZip();
		let pack = mainModel.generateBlockModel.siteInfo.pack;
		let pages = mainModel.generateBlockModel.pages;
		let sections = mainModel.generateBlockModel.sections;
		let siteTitle = mainModel.generateBlockModel.siteInfo.siteTitle;
		let extension =  mainModel.settingsModel.extension;
		let origin =  mainModel.generateBlockModel.siteInfo.origin;
		if (!siteTitle) return;
		let siteName = getSiteName(siteTitle);

		zip.file(siteName + extension,
			siteCode(pack, origin, siteName, mainModel));

		this.generatedPages.forEach((page, index)=>
			zip.folder("pages").file(getPageName(pages[index].name) + extension, page)
		);

		sections.forEach(section =>
			zip.folder("sections").file(getClassName(section.Name) + extension,
				sectionCode(pack, section, mainModel))
		);

		sections.forEach(section => {
			if (section.Type === "Form") {
				zip.folder("entities").file(getEntityName(section.Name) + extension,
					entityCode(pack, section, mainModel))
			}}
		);

		zip.generateAsync({ type: "blob" }).then(
			function (content) {
				saveAs(content, "pageobject.zip");
			}
		);
	}
}

function varName (name) {
	return name[0].toLowerCase() + name.slice(1);
}

function getClassName (name) {
	let words = name.split(/\W/);
	return words.map(word => word[0].toUpperCase() + word.slice(1)).join('');
}

function poName (name, poName) {
	let result = getClassName(name);
	if (result.length > 4 && result.substr(-4).toLowerCase() !== poName.toLowerCase())
		result += poName;
	return result;
}

function getSiteName (name) {
	return poName(name, "Site");
}

function getPageName (name) {
	return poName(name, "Page");
}

function locatorType (locator) {
	return locator.indexOf('/') !== 1 ? "Css" : "XPath";
}

function elementCode (locatorType, locator, elType, name) {
	return ` @${locatorType}(${locator}) public ${elType} ${varName(name)};
	`;
}

function simpleCode (locatorType, locator, elType, name) {
	return elementCode(locatorType, `"${locator}"`, elType, name)
}

function pageElementCode (page, pageName) {
	return `@JPage(url = "${page.url}", title = "${page.title}") 
	public static ${getPageName(pageName)} ${varName(pageName)};
	`;
};

function complexLocators (el, fields) {
	let locators = [];
	for (let field in fields) {
		let locator = el[field];
		if (!!locator && typeof locator === 'string') {
			locators.push(`${field.toLowerCase()} = @FindBy(${locatorType(locator).toLowerCase()} ="${locator}")`);
		}
	}
	return locators.join(",\n\t\t\t") + "\n\t";
}

function getFields (obj, commonFields) {
	let clone = Object.assign({}, obj);

	for (let field in commonFields) {
		delete clone[field];
	}
	return clone;
}

function isSimple (el, fields) {
	let count = 0;

	for (let field in fields) {
		if (el[field] !== "") count++;
	}
	return count === 1;
}

function genEntities (parentId, arrOfElements, mainModel) {
	const { ruleBlockModel } = mainModel;
	const complex = ruleBlockModel.rules.ComplexRules;
	const simple = ruleBlockModel.rules.SimpleRules;
	return arrOfElements
		.filter(el => el.parentId === parentId && (simple[el.Type] || complex[el.Type]) && el.Type != "Button")
		.map(el => `public String ${varName(el.Name)};`).join('\n\t');
}

function getElement (el, generateBlockModel) {
	return typeof el === 'string' ? generateBlockModel.sections.get(el) : el;
}

function genCodeOfElements (parentId, arrOfElements, mainModel) {
	const { ruleBlockModel, generateBlockModel } = mainModel;
	const composites = ruleBlockModel.rules.CompositeRules;
	const complex = ruleBlockModel.rules.ComplexRules;
	const simple = ruleBlockModel.rules.SimpleRules;

	let result = '';
	for (let i = 0; i < arrOfElements.length; i++) {
		let el = getElement(arrOfElements[i], generateBlockModel);
		if (el.parentId === parentId && (!!el.Locator || !!el.Root)) {
			if (!!composites[el.Type]) {
				result += simpleCode(locatorType(el.Locator), el.Locator, getClassName(el.Name), el.Name);
			}
			if (!!complex[el.Type]) {
				let fields = getFields(ruleBlockModel.elementFields[el.Type]);
				result += isSimple(el, fields)
					? simpleCode(locatorType(el.Root), el.Root, el.Type, el.Name)
					: elementCode("J" + el.Type, complexLocators(el, fields), el.Type, el.Name);
			}
			if (!!simple[el.Type]) {
				result += simpleCode(locatorType(el.Locator), el.Locator, el.Type, el.Name);
			}
		}
	}
	return result;
}

function getPageCode (mainModel) {
	return mainModel.generateBlockModel.pages.map(page => pageElementCode(page, getPageName(page.name))).join('');
	// return objCopy.PageObjects.map(page=>pageElementCode(page, getPageName(page.name))).join('');
}

function commonImport () {
	return `
import com.epam.jdi.uitests.web.selenium.elements.common.*;
import com.epam.jdi.uitests.web.selenium.elements.complex.*;
import com.epam.jdi.uitests.web.selenium.elements.composite.*;
import com.epam.jdi.uitests.web.selenium.elements.composite.WebPage;
import com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.objects.*;
import com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.simple.*;
import com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.FindBy;`;
}

function sectionTemplate (pack, name, code) {
	return `package ${pack}.sections;
${commonImport()}

public class ${getClassName(name)} extends Section {
	${code}
}`;
}

function formTemplate (pack, name, code, entityName) {
	return `package ${pack}.sections;
${commonImport()}
import ${pack}.entities.*;

public class ${getClassName(name)} extends Form<${entityName}> {
	${code}
}`;
}

export function getEntityName (name) {
	return getClassName(name.slice(0, -4) + "s");
}

export function sectionCode (pack, el, mainModel) {
	let code = genCodeOfElements(el.elId, el.children, mainModel);
	switch (el.Type) {
		case "Section":
			return sectionTemplate(pack, el.Name, code);
		case "Form":
			return formTemplate(pack, el.Name, code, getEntityName(el.Name));
	};
}

export function entityCode (pack, section, mainModel) {
	let entityName = getEntityName(section.Name);
	return `package ${pack}.entities;

import com.epam.jdi.tools.DataClass;

public class ${entityName} extends DataClass<${entityName}> {
	${genEntities(section.elId, section.children, mainModel)}
}`;
}

export function siteCode (pack, domain, name, mainModel) {
	return `package ${pack};
	
import ${pack}.pages.*;
import com.epam.jdi.uitests.web.selenium.elements.composite.WebSite;
import com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.*;

@JSite("${domain}")
public class ${name} extends WebSite {
	${getPageCode(mainModel)}
}`;
}

export function pageCode (page, mainModel) {
	let pageName = getPageName(page.name);
	return `package ${page.package}.pages;
${commonImport()}
import ${page.package}.sections.*;

public class ${pageName} extends WebPage {
	${genCodeOfElements(null, page.elements, mainModel)}
}`;
}

export function seleniumPageCode (page) {
	let pageName = getPageName(page.name);
	return `package ${page.package}.pages;
		
import com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.FindBy;
import org.openqa.selenium.WebElement;

public class ${pageName} {
	${genCodeOfWEBElements(page.elements)}
}`;
}

function findByCode (el) {
	let locator = el.Locator;
	let name = el.Name;
	return elementCode("FindBy", `${locatorType(locator).toLowerCase()} ="${locator}"`, "WebElement", name);
}

function genCodeOfWEBElements (arrOfElements) {
	return arrOfElements.map(el => `${findByCode(el)}`).join("");
}
