import { genRand, cssToXPath } from "../utils/helpers";
import { observable, action } from 'mobx';
import Log from "./Log";

export default class GenerateBlockModel {
	@observable log;
	@observable jdi = true;
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

	constructor () {
		this.log = new Log();
		this.sections = new Map();
	}

	@action
	generate (mainModel) {
		const { ruleBlockModel, settingsModel, conversionModel } = mainModel;
		const rulesObj = ruleBlockModel.rules;
		const composites = Object.keys(rulesObj.CompositeRules);
		const complex = Object.keys(rulesObj.ComplexRules);
		const simple = Object.keys(rulesObj.SimpleRules);

		const results = [];
		const relatives = new Map();
		this.page = {
			id: '',
			name: '',
			title: '',
			url: '',
			package: '',
			elements: []
		};

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

		function isXpath (locator) {
			return locator[1] === '/';
		}

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

		function getElementsByXpath (dom, locator) {
			let results = [];
			let result = document.evaluate(locator, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for (let i = 0; i < result.snapshotLength; i++) {
				results.push(result.snapshotItem(i));
			}
			return results;
		}

		function getValue (content, uniqness) {
			switch (uniqness.value) {
				case "text":
					return content.innerText.trim().split(/\n/)[0];
				default:
					return content.attributes[uniqness.value] ? content.attributes[uniqness.value].value : undefined;
			}
		}

		const getElements = (dom, locatorType) => {
			let elements = [];
			try {
				elements = locatorType.xpath ? getElementsByXpath(dom, locatorType.locator) : dom.querySelectorAll(locatorType.locator);
			} catch (e) {
				this.log.addToLog(`Error!: cannot get elements by ${locatorType.locator}`);
				// objCopy.warningLog = [...objCopy.warningLog, getLog()];
				document.querySelector('#refresh').click();
			}
			return {
				elements: elements,
				locatorType: locatorType
			};
		};

		function searchByWithoutValue (dom, locator, uniqness) {
			let locatorType = getCorrectLocator(dom, locator, uniqness);
			return getElements(dom, locatorType);
		}

		function nameElement (locator, uniqness, value, content) {
			if (uniqness === "text" || uniqness.includes("#text")) {
				return (camelCase(value) || camelCase(content.innerText));
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

		const checkIfItIsUnique = (element) => {
			let locator = element.Locator || element.Root;
			let check = true;
			if (!element.parentId) {
				this.sections.forEach((section) => {
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

		const findSection = (locator, type) => {
			let id;
			this.sections.forEach((value, key) => {
				if (value.Locator === locator && value.Type === type) {
					id = key;
				}
			});
			return id;
		};

		function fillEl (element, type, parent, ruleId) {
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
				if (checkIfItIsUnique(result)) {
					applyFoundResult(result, parent, ruleId);
				}
			}
		}

		const findInParent = (element, parent) => {
			let loc = element.Locator ? "Locator" : "Root";
			//let found = objCopy.sections.find((section) => parent.Locator === section.Locator && parent.Type === section.Type);
			let found, find;
			this.sections.forEach((value, key) => {
				if (value.elId === parent.elId && value.Name === parent.Name) {
					found = key;
				}
			});

			if (!!found) {
				let sec = this.sections.get(found);
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
					this.sections.set(found, sec);
				}
			}
			this.page.elements.push(element);
		};

		const applyFoundResult = (e, parent, ruleId) => {
			let element = {
				Name: e.Name || genRand(e.Type),
				Type: e.Type,
				parent: e.parent || null,
				parentId: e.parentId,
				elId: e.elId
			};
			if (simple.indexOf(e.Type) > -1) {
				element.Locator = e.Locator;
				findInParent(element, parent);
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
				findInParent(element, parent);
				return;
			}
			let fields = ruleBlockModel.elementFields[e.Type];
			if (composites.indexOf(e.Type) > -1) {
				element.Locator = e.Locator;
				element.isSection = true;
				element.children = e.children || [];
				let found = this.sections.get(element.elId);

				if (!!found) {
					// element = found;
					this.page.elements.push(found.elId);
				} else {
					for (let f in fields) {
						if (!element.hasOwnProperty(f)) {
							element[f] = "";
						}
					}
					this.page.elements.push(element.elId);
					this.sections.set(element.elId, element);
				}
				return;
			}
		};

		const defineElements = (dom, Locator, uniq, t, ruleId, parent) => {
			let splitUniqness = uniq.split("#");
			let uniqness = {
				locator: splitUniqness.length == 2 ? splitUniqness[0] : "",
				value: splitUniqness.length == 2 ? splitUniqness[1] : uniq
			};
			let firstSearch = searchByWithoutValue(dom, Locator, uniqness);
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
				fillEl(e, t, parent, ruleId);
				return;
			}
			let tooMuchElements = `Too much elements found(${elements.length} for ${uniqness.value}. Locator (${firstSearch.locatorType.locator}))`;
			this.log.addToLog(tooMuchElements);
			if (elements.length > 1) {
				if (uniqness.value === "tag" || uniqness.value === '[') {
					this.log.addToLog(`Warning! Too much elements found by locator ${firstSearch.locatorType.locator}; uniqness ${uniqness.value}; ${elements.length} elements`);
					// document.querySelector('#refresh').click();
				}
				for (let i = 0; i < elements.length; i++) {
					let val = getValue(elements[i], uniqness, Locator);
					let finalLocator = xpath
						? valueToXpath(firstSearch.locatorType.locator, uniqness, val)
						: firstSearch.locatorType.locator + valueToCss(uniqness, val);
					let s2 = getElements(dom, { locator: finalLocator, xpath: xpath });
					if (s2.elements.length === 1) {
						let e = {
							Locator: finalLocator,
							content: s2.elements[0],
							Name: nameElement(finalLocator, uniq, val, s2.elements[0]).slice(0, 20),
						};
						fillEl(e, t, parent, ruleId);
					} else {
						this.log.addToLog(`Warning! Too much elements found by locator ${finalLocator}; ${s2.elements.length} elements`);
						// document.querySelector('#refresh').click();
					}
				}
			}
		};

		function getComposite(dom, t) {
			let rules = rulesObj.CompositeRules[t];
			rules.forEach((rule) => {
				if (!!rule.Locator) {
					defineElements(dom, rule.Locator, rule.uniqness, t, rule.id);
				}
			});

			for (let k = 0; k < results.length; k++) {
				relatives.set(results[k].elId, 0);
				let child = results[k];
				for (let j = 0; j < results.length; j++) {
					parent = results[j];
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
					parent = results[j];
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

		function getComplex (parent, t) {
			let dom = parent.content;
			let rules = rulesObj.ComplexRules[t];
			rules.forEach((rule) => {
				if (!!rule.Root) {
					defineElements(dom, rule.Root, rule.uniqness, t, rule.id, parent)
				}
			})
		}

		function getSimple (parent, t) {
			let dom = parent.content;
			let rules = rulesObj.SimpleRules[t];
			rules.forEach((rule, i) => {
				if (!!rule.Locator) {
					defineElements(dom, rule.Locator, rule.uniqness, t, rule.id, parent);
				}
			});
		};

		function hashCode(str) {
			let hash = 0, i, chr;

			if (str === 0) return hash;

			for (i = 0; i < str.length; i++) {
				chr   = str.charCodeAt(i);
				hash  = ((hash << 5) - hash) + chr;
				hash |= 0; // Convert to 32bit integer
			}
			return hash;
		};

		chrome.devtools.inspectedWindow.eval('document.location', (r, err) => {
			this.page.url = r.pathname;
			this.page.id = hashCode(r.pathname);
			this.siteInfo.hostName = r.hostname;
			this.page.package = r.host ? r.host.split('.').reverse().join('.') : '';
			this.siteInfo.siteTitle = camelCase(r.hostname.substring(0, r.hostname.lastIndexOf(".")));
			this.siteInfo.origin = r.origin;
			mainModel.setPageId(this.page.id);
		});

		chrome.devtools.inspectedWindow.eval('document.domain', (r, err) => {
			if (r !== "") {
				this.siteInfo.domainName = r;
				this.siteInfo.pack = r.split('.').reverse().join('.');
			}
		});

		chrome.devtools.inspectedWindow.eval('document.title', (r, err) => {
			if (r !== "") {
				this.page.title = r;
				this.page.name = camelCase(r);
			}
		});

		chrome.devtools.inspectedWindow.eval(
			'document.body.outerHTML', (r, err) => {
				if (err) {
					this.log.addToLog(`Error, loading data from active page! ${err}`);
					// objCopy.warningLog = [...objCopy.warningLog, getLog()];
					// document.querySelector('#refresh').click();
				}

				let parser = new DOMParser();
				let observedDOM = parser.parseFromString(r, "text/html").body;
				//let copyOfDom = parser.parseFromString(r, "text/html").body;

				if (this.jdi) {
					composites.forEach((rule) => {
						try {
							getComposite(observedDOM, rule)
						} catch (e) {
							this.log.addToLog(`Error! Getting composite element: ${e}`);
							// objCopy.warningLog = [...objCopy.warningLog, getLog()];
							// document.querySelector('#refresh').click();
						};
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
						applyFoundResult(results[i]);
					}

					for (let i = 0; i < results.length; i++) {
						results[i].content.parentNode.removeChild(results[i].content);
					}


					results.forEach((section) => {
						complex.forEach((rule) => {
							try {
								getComplex(section, rule);
							} catch (e) {
								this.log.addToLog(`Error! Getting complex element: ${e}`);
								// objCopy.warningLog = [...objCopy.warningLog, getLog()];
								// document.querySelector('#refresh').click();
							}
						});
					});
				} else {
					results.push({ Locator: "body", Type: null, content: observedDOM, elId: null, parentId: null, parent: null });
				}

				results.forEach((section) => {
					simple.forEach((rule) => {
						try {
							getSimple(section, rule);
						} catch (e) {
							this.log.addToLog(`Error! Getting simple element: ${e}`);
							// objCopy.warningLog = [...objCopy.warningLog, getLog()];
							// document.querySelector('#refresh').click();
						}
					});
				});

				if (!this.pages.includes(this.page.id)) {
					this.pages.push(this.page);
					mainModel.conversionModel.siteCodeReady = true;
					conversionModel.genPageCode(this.page, mainModel);

					if (settingsModel.downloadAfterGeneration) {
						conversionModel.downloadPageCode(this.page, mainModel.settingsModel.extension);
					}
				}

				// console.log(this.page.elements)
				// console.log(this.sections)

				// map = drawMap(page.elements, objCopy.sections, new Map());
				// objCopy.pageMap = map;
				// objCopy.resultTree = getChildren(map, null);
			}
		)
	}
}

/*
* hashCode = function(str) {
  var hash = 0, i, chr;
  if (str === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
* */
