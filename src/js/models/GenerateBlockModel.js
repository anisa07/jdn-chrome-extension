import { genRand, cssToXPath } from "../utils/helpers";
import { observable, action } from 'mobx';
import Log from "./Log";

const getElements = ({ log }, dom, locatorType) => {
	let elements = [];
	try {
		elements = locatorType.xpath ? getElementsByXpath(dom, locatorType.locator) : dom.querySelectorAll(locatorType.locator);
	} catch (e) {
		log.addToLog({
			message: `Error!: cannot get elements by ${locatorType.locator}`,
			type: 'error',
		});
		// objCopy.warningLog = [...objCopy.warningLog, getLog()];
		document.querySelector('#refresh').click();
	}
	return {
		elements: elements,
		locatorType: locatorType
	};
};

function generateLocator (xpath, locator) {
	return xpath === isXpath(locator) ? locator : cssToXPath(locator);
}

function getCorrectLocator (dom, locator, uniqness) {
	let results = {
		xpath: isXpath(locator) || isXpath(uniqness.locator) || uniqness.value === "text",
		locator: ""
	};
	results.locator = generateLocator(results.xpath, locator);
	results.locator = results.locator.indexOf('//') === 0 ? '.' + results.locator : results.locator;
	if (uniqness.locator) results.locator += generateLocator(results.xpath, uniqness.locator);
	return results;
}

function searchByWithoutValue ({ log }, dom, locator, uniqness) {
	let locatorType = getCorrectLocator(dom, locator, uniqness);
	return getElements({ log }, dom, locatorType);
}

function camelCase (n) {
	let name = "";
	if (n) {
		let arrayName = n.split(/[^a-zA-Zа-яёА-ЯЁ0-9]/);
		for (let j = 0; j < arrayName.length; j++) {
			if (arrayName[j]) {
				name += arrayName[j][0].toUpperCase() + arrayName[j].slice(1);
			}
		}
	}
	return name;
}

function nameElement (locator, uniqness, value, content) {
	if (uniqness === "text" || uniqness.includes("#text")) {
		return camelCase(value || (content.innerText || content.textContent).trim());
	}
	if (uniqness.includes('tag')) {
		return camelCase(content.tagName.toLowerCase());
	}
	if (uniqness.indexOf('[') === 0) {
		return camelCase(locator.replace(/[\.\/\*\[\]@]/g, ''));
	}
	if (uniqness === "class") {
		return camelCase(content.classList.value);
	}
	return camelCase(content.getAttribute(uniqness));
}

function createCorrectXpath (originalLocator, uniqness, value, locator) {
	let result = uniqness === "text" ? `contains(.,'${value/*.split(/\n/)[0]*/}')` : `@${uniqness}='${value}')`;
	if (locator) {
		return `${originalLocator}${locator}${result}`
	}
	if (originalLocator.indexOf(']') === originalLocator.length - 1) {
		return `${originalLocator.slice(0, -1)} and ${result}]`
	} else {
		return `${originalLocator}[${result}]`
	}
}

function valueToXpath (originalLocator, uniqness, value) {
	if (!!value) {
		if (!!uniqness.locator) {
			return createCorrectXpath(originalLocator, uniqness, value, uniqness.locator);
		}
		if (isXpath(uniqness.value)) {
			return createCorrectXpath(originalLocator, uniqness, value);
		} else {
			return createCorrectXpath(originalLocator, uniqness.value, value);
		}
	}
	return originalLocator;
}

function valueToCss (uniqness, value) {
	if (!!value) {
		switch (uniqness.value) {
			case "class":
				return `.${value.replace(/\s/g, '.')}`;
			case "id":
				return `#${value}`;
			default:
				return `[${uniqness.value}='${value}']`
		}
	}
	return '';
}

const checkIfItIsUnique = ({ sections }, element) => {
	let locator = element.Locator || element.Root;
	let check = true;
	if (!element.parentId) {
		sections.forEach((section) => {
			section.children.forEach((child) => {
				let loc = child.Locator || child.Root;
				if (loc === locator) {
					check = false;
				}
			})
		})
	}
	return check;
};

function hashCode (str) {
	let hash = 0, i, chr;

	if (str === 0) return hash;

	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

const findInParent = ({ sections, page }, element, parent) => {
	let loc = element.Locator ? "Locator" : "Root";
	//let found = objCopy.sections.find((section) => parent.Locator === section.Locator && parent.Type === section.Type);
	let found, find;
	sections.forEach((value, key) => {
		if (value.elId === parent.elId && value.Name === parent.Name) {
			found = key;
		}
	});

	if (!!found) {
		let sec = sections.get(found);
		let children = sec.children;
		for (let i = 0; i < children.length; i++) {
			if (children[i][loc] === element[loc]) {
				element.elId = children[i].elId;
				find = true;
				break;
			}
		}
		if (!find) {
			children.push(element);
			sections.set(found, sec);
		}
	}
	page.elements.push(element);
};

const applyFoundResult = ({ mainModel }, e, parent, ruleId) => {
	const { ruleBlockModel, generateBlockModel } = mainModel;
	const rulesObj = ruleBlockModel.rules;
	const composites = Object.keys(rulesObj.CompositeRules);
	const complex = Object.keys(rulesObj.ComplexRules);
	const simple = Object.keys(rulesObj.SimpleRules);

	let element = {
		Name: e.Name || genRand(e.Type),
		Type: e.Type,
		parent: e.parent || null,
		parentId: e.parentId,
		elId: e.elId
	};
	if (simple.indexOf(e.Type) > -1) {
		element.Locator = e.Locator;
		findInParent({ sections: generateBlockModel.sections, page: generateBlockModel.page }, element, parent);
		return;
	}
	if (complex.indexOf(e.Type) > -1) {
		let fields = rulesObj.ComplexRules[e.Type].find((r) => r.id === ruleId);
		element.Root = e.Locator;
		for (let f in fields) {
			if (!element.hasOwnProperty(f) && f !== "Root") {
				element[f] = fields[f];
			}
		}
		findInParent({ sections: generateBlockModel.sections, page: generateBlockModel.page }, element, parent);
		return;
	}
	let fields = ruleBlockModel.elementFields[e.Type];
	if (composites.indexOf(e.Type) > -1) {
		element.Locator = e.Locator;
		element.isSection = true;
		element.children = e.children || [];
		let found = generateBlockModel.sections.get(element.elId);

		if (!!found) {
			// element = found;
			generateBlockModel.page.elements.push(found.elId);
		} else {
			for (let f in fields) {
				if (!element.hasOwnProperty(f)) {
					element[f] = "";
				}
			}
			generateBlockModel.page.elements.push(element.elId);
			generateBlockModel.sections.set(element.elId, element);
		}
		return;
	}
};

function fillEl ({ results, mainModel }, element, type, parent, ruleId) {
	const { ruleBlockModel, generateBlockModel } = mainModel;
	const rulesObj = ruleBlockModel.rules;
	const composites = Object.keys(rulesObj.CompositeRules);
	let result = { ...element, Type: type };
	if (composites.includes(type)) {
		result.parent = null;
		result.parentId = null;
		result.elId = hashCode(element.Locator + type);
		results.push(result);
	} else {
		result.parentId = parent.elId;
		result.parent = parent.Name;
		result.elId = genRand('El');
		if (checkIfItIsUnique({ sections: generateBlockModel.sections }, result)) {
			applyFoundResult({ mainModel }, result, parent, ruleId);
		}
	}
}

function getValue (content, uniqness) {
	switch (uniqness.value) {
		case "text":
			return (content.innerText || content.textContent).trim().split(/\n/)[0];
		default:
			return content.attributes[uniqness.value] ? content.attributes[uniqness.value].value : undefined;
	}
}

const defineElements = ({ results, mainModel }, dom, Locator, uniq, t, ruleId, parent) => {
	const { generateBlockModel } = mainModel;

	let splitUniqness = uniq.split("#");
	let uniqness = {
		locator: splitUniqness.length == 2 ? splitUniqness[0] : "",
		value: splitUniqness.length == 2 ? splitUniqness[1] : uniq
	};
	let firstSearch = searchByWithoutValue({ log: generateBlockModel.log }, dom, Locator, uniqness);
	let xpath = firstSearch.locatorType.xpath;
	let elements = firstSearch.elements;
	if (elements.length === 0) {
		return;
	}
	if (elements.length === 1) {
		let e = {
			Locator: firstSearch.locatorType.locator,
			content: elements[0],
			Name: nameElement(firstSearch.locatorType.locator, uniq, '', elements[0]).slice(0, 20),
		};
		fillEl({ results, mainModel }, e, t, parent, ruleId);
		return;
	}
	generateBlockModel.log.addToLog({
		message: `Warning! Too much elements found(${elements.length} for ${uniqness.value}. Locator (${firstSearch.locatorType.locator}))`,
		type: 'warning'
	});
	if (elements.length > 1) {
		if (uniqness.value === "tag" || uniqness.value === '[') {
			generateBlockModel.log.addToLog({
				message: `Warning! Too much elements found by locator ${firstSearch.locatorType.locator}; uniqness ${uniqness.value}; ${elements.length} elements`,
				type: 'warning',
			});
			// document.querySelector('#refresh').click();
		}
		for (let i = 0; i < elements.length; i++) {
			let val = getValue(elements[i], uniqness, Locator);
			let finalLocator = xpath
				? valueToXpath(firstSearch.locatorType.locator, uniqness, val)
				: firstSearch.locatorType.locator + valueToCss(uniqness, val);
			let s2 = getElements({ log: generateBlockModel.log }, dom, { locator: finalLocator, xpath: xpath });
			if (s2.elements.length === 1) {
				let e = {
					Locator: finalLocator,
					content: s2.elements[0],
					Name: nameElement(finalLocator, uniq, val, s2.elements[0]).slice(0, 20),
				};
				fillEl({ results, mainModel }, e, t, parent, ruleId);
			} else {
				generateBlockModel.log.addToLog({
					message: `Warning! Too much elements found by locator ${finalLocator}; ${s2.elements.length} elements`,
					type: 'warning',
				});
				// document.querySelector('#refresh').click();
			}
		}
	}
};

function getElementsByXpath (dom, locator) {
	let results = [];
	let result = document.evaluate(locator, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (let i = 0; i < result.snapshotLength; i++) {
		results.push(result.snapshotItem(i));
	}
	return results;
}

function isXpath (locator) {
	return locator[1] === '/';
}

function getComposite ({ mainModel, results }, dom, t) {
	const { ruleBlockModel } = mainModel;
	const rulesObj = ruleBlockModel.rules;
	const relatives = new Map();
	const rules = rulesObj.CompositeRules[t];

	rules.forEach((rule) => {
		if (!!rule.Locator) {
			defineElements({ mainModel, results }, dom, rule.Locator, rule.uniqness, t, rule.id, null);
		}
	});


	for (let k = 0; k < results.length; k++) {
		relatives.set(results[k].elId, 0);
		let child = results[k];
		for (let j = 0; j < results.length; j++) {
			const parent = results[j];
			let r = isXpath(child.Locator) ? getElementsByXpath(parent.content, child.Locator) : parent.content.querySelectorAll(child.Locator);
			for (let i = 0; i < r.length; i++) {
				if (r[i] === child.content) {
					let v = relatives.get(child.elId);
					relatives.set(child.elId, ++v);
				}
			}
		}
	}

	for (let k = 0; k < results.length; k++) {
		let child = results[k];
		for (let j = 0; j < results.length; j++) {
			const parent = results[j];
			let r = isXpath(child.Locator) ? getElementsByXpath(parent.content, child.Locator) : parent.content.querySelectorAll(child.Locator);
			for (let i = 0; i < r.length; i++) {
				if (r[i] === child.content) {
					let c = relatives.get(child.elId);
					let p = relatives.get(parent.elId);
					if (c - p === 1) {
						child.parent = parent.Type;
						child.parentId = parent.elId;
					}
				}
			}
		}
	}
}

function getComplex ({ mainModel, results }, parent, t) {
	const { ruleBlockModel } = mainModel;
	const rulesObj = ruleBlockModel.rules;

	let dom = parent.content;
	let rules = rulesObj.ComplexRules[t];
	rules.forEach((rule) => {
		if (!!rule.Root) {
			defineElements({ mainModel, results }, dom, rule.Root, rule.uniqness, t, rule.id, parent)
		}
	})
}

function getSimple ({ mainModel, results }, parent, t) {
	const { ruleBlockModel } = mainModel;
	const rulesObj = ruleBlockModel.rules;

	let dom = parent.content;
	let rules = rulesObj.SimpleRules[t];
	rules.forEach((rule, i) => {
		if (!!rule.Locator) {
			defineElements({ mainModel, results }, dom, rule.Locator, rule.uniqness, t, rule.id, parent);
		}
	});
};

export const generationCallBack = ({ mainModel }, r, err) => {
	const parser = new DOMParser();
	const observedDOM = parser.parseFromString(r, "text/html").body;
	// document.evaluate(".//*[@ui='label' and contains(.,'Bootstrap')]", observedDOM, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	//let copyOfDom = parser.parseFromString(r, "text/html").body;
	const { ruleBlockModel, settingsModel, conversionModel, generateBlockModel } = mainModel;
	const rulesObj = ruleBlockModel.rules;
	const composites = Object.keys(rulesObj.CompositeRules);
	const complex = Object.keys(rulesObj.ComplexRules);
	const simple = Object.keys(rulesObj.SimpleRules);
	const results = [];

	if (err) {
		generateBlockModel.log.addToLog({
			message: `Error, loading data from active page! ${err}`,
			type: 'error',
		});
		// objCopy.warningLog = [...objCopy.warningLog, getLog()];
		// document.querySelector('#refresh').click();
	}

	if (r) {
		composites.forEach((rule) => {
			try {
				getComposite({ mainModel, results }, observedDOM, rule)
			} catch (e) {
				generateBlockModel.log.addToLog({
					message: `Error! Getting composite element: ${e}`,
					type: 'error',
				});
				// objCopy.warningLog = [...objCopy.warningLog, getLog()];
				// document.querySelector('#refresh').click();
			}
			;
		});

		for (let i = 0; i < results.length; i++) {
			let findParent = results.find(section => section.elId === results[i].parentId && results[i].parentId !== null);
			if (findParent) {
				if (findParent.children) {
					findParent.children.push(results[i]);
				} else {
					findParent.children = [];
					findParent.children.push(results[i]);
				}
			}
		}

		results.push({ Locator: "body", Type: null, content: observedDOM, elId: null, parentId: null, parent: null });

		for (let i = 0; i < results.length - 1; i++) {
			applyFoundResult({ mainModel }, results[i]);
		}

		for (let i = 0; i < results.length; i++) {
			results[i].content.parentNode.removeChild(results[i].content);
		}

		results.forEach((section) => {
			complex.forEach((rule) => {
				try {
					getComplex({ mainModel, results }, section, rule);
				} catch (e) {
					generateBlockModel.log.addToLog({
						message: `Error! Getting complex element: ${e}`,
						type: 'error',
					});
					// objCopy.warningLog = [...objCopy.warningLog, getLog()];
					// document.querySelector('#refresh').click();
				}
			});
		});

		results.forEach((section) => {
			simple.forEach((rule) => {
				try {
					getSimple({ mainModel, results }, section, rule);
				} catch (e) {
					generateBlockModel.log.addToLog({
						message: `Error! Getting simple element: ${e}`,
						type: 'error',
					});
					// objCopy.warningLog = [...objCopy.warningLog, getLog()];
					// document.querySelector('#refresh').click();
				}
			});
		});

		const pageAlreadyGenerated = generateBlockModel.pages.find(page => page.id === generateBlockModel.page.id);

		if (!pageAlreadyGenerated) {
			generateBlockModel.pages.push(generateBlockModel.page);
			// mainModel.conversionModel.siteCodeReady = true;
			// conversionModel.genPageCode(generateBlockModel.page, mainModel);

			if (settingsModel.downloadAfterGeneration) {
				conversionModel.downloadPageCode(generateBlockModel.page, mainModel.settingsModel.extension);
			}
			generateBlockModel.log.addToLog({
				message: `Success! Generates ${generateBlockModel.page.name}`,
				type: 'success',
			});
			mainModel.fillLog(generateBlockModel.log.log);
		}
		// TODO create beautiful popup
	}

	// console.log(this.page.elements)
	// console.log(this.sections)

	// map = drawMap(page.elements, objCopy.sections, new Map());
	// objCopy.pageMap = map;
	// objCopy.resultTree = getChildren(map, null);
};

export const getLocationCallBack = ({ mainModel }, r, err) => {
	const { generateBlockModel } = mainModel;

	if (err) {
		generateBlockModel.log.addToLog({
			message: `Error, getting location from active page! ${err}`,
			type: 'error',
		});
		// objCopy.warningLog = [...objCopy.warningLog, getLog()];
		// document.querySelector('#refresh').click();
	}

	if (r) {
		generateBlockModel.page.url = r.pathname;
		generateBlockModel.page.id = hashCode(r.pathname);
		generateBlockModel.siteInfo.hostName = r.hostname;
		generateBlockModel.page.package = r.host ? r.host.split('.').reverse().join('.') : '';
		generateBlockModel.siteInfo.siteTitle = camelCase(r.hostname.substring(0, r.hostname.lastIndexOf(".")));
		generateBlockModel.siteInfo.origin = r.origin;
		generateBlockModel.currentPageId = hashCode(r.pathname);
	}
};

export const getDomainCallBack = ({ mainModel }, r, err) => {
	const { generateBlockModel } = mainModel;

	if (err) {
		generateBlockModel.log.addToLog({
			message: `Error, getting domain from active page! ${err}`,
			type: 'error',
		});
		// objCopy.warningLog = [...objCopy.warningLog, getLog()];
		// document.querySelector('#refresh').click();
	}

	if (r) {
		generateBlockModel.siteInfo.domainName = r;
		generateBlockModel.siteInfo.pack = r.split('.').reverse().join('.');
	}
};

export const getTitleCallBack = ({ mainModel }, r, err) => {
	const { generateBlockModel } = mainModel;

	if (err) {
		generateBlockModel.log.addToLog({
			message: `Error, getting title from active page! ${err}`,
			type: 'error',
		});
		// objCopy.warningLog = [...objCopy.warningLog, getLog()];
		// document.querySelector('#refresh').click();
	}

	if (r) {
		generateBlockModel.page.title = r;
		generateBlockModel.page.name = camelCase(r);
	}
};

export default class GenerateBlockModel {
	@observable log;
	@observable sections;
	@observable pages = [];
	@observable page = {
		id: '',
		name: '',
		title: '',
		url: '',
		package: '',
		elements: []
	};
	@observable siteInfo = {};
	@observable currentPageId;

	constructor () {
		this.log = new Log();
		this.sections = new Map();
	}

	@action
	generate (mainModel) {
		this.page = {
			id: '',
			name: '',
			title: '',
			url: '',
			package: '',
			elements: []
		};

		this.log.clearLog();

		chrome.devtools.inspectedWindow.eval('document.location', (r, err) => {
			getLocationCallBack({ mainModel }, r, err);
		});

		chrome.devtools.inspectedWindow.eval('document.domain', (r, err) => {
			getDomainCallBack({ mainModel }, r, err);
		});

		chrome.devtools.inspectedWindow.eval('document.title', (r, err) => {
			getTitleCallBack({ mainModel }, r, err);
		});

		chrome.devtools.inspectedWindow.eval('document.body.outerHTML', (r, err) => {
			generationCallBack({ mainModel }, r, err)
		});
	}
}
