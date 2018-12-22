import { observable, action } from 'mobx';
import RulesJson from '../json/rules';

export default class RulesBlockModel {
	@observable rules;
	rulesStorageName = 'JDNElementRules';
	@observable currentRuleSet = '';
	@observable currentRuleName = '';
	@observable currentRuleItem = 0;
	@observable elementFields = {};

	commonFields = {
//		"Name": "TextField",
//		"Type": "ComboBox",
		"parent": "internal",
		"parentId": "internal",
		"elId": "internal"
	};

	// TODO make this name editable in the next generation
	@observable ruleName = 'Default rules';

	constructor () {
		const rulesStorage = window.localStorage;
		const rulesFromStorage = rulesStorage.getItem(this.rulesStorageName);

		if (rulesFromStorage) {
			this.rules = JSON.parse(rulesFromStorage);
		} else {
			this.rules = JSON.parse(JSON.stringify(RulesJson));
			rulesStorage.setItem(this.rulesStorageName, JSON.stringify(RulesJson));
		}

		const composites = Object.keys(this.rules.CompositeRules);
		const complex = Object.keys(this.rules.ComplexRules);
		const simple = Object.keys(this.rules.SimpleRules);

		simple.forEach(rule => {
			this.elementFields[rule] = {
				...this.commonFields,
				Locator: 'TextField'
			}
		});

		composites.forEach(rule => {
			this.elementFields[rule] = {
				...this.commonFields,
				Locator: 'TextField',
				isSection: 'internal',
				expanded: 'internal',
				children: 'internal'
			};
			if (rule.toLowerCase() === 'form') {
				this.elementFields[rule].Entity = "TextField";
			}
		});

		complex.forEach(rule => {
			this.elementFields[rule] = {
				...this.commonFields,
				Root: 'TextField'
			};
			if (rule.toLowerCase().includes('table')) {
				this.elementFields[rule] = {
					...this.elementFields[rule],
					...{
						"Headers": "TextField",
						"RowHeaders": "TextField",
						"Header": "TextField",
						"RowHeader": "TextField",
						"Cell": "TextField",
						"Column": "TextField",
						"Row": "TextField",
						"Footer": "TextField",
						"Height": "TextField",
						"Width": "TextField",
						"RowStartIndex": "TextField",
						"UseCache": "Checkbox",
						"HeaderTypes": "ComboBox",
						"HeaderTypesValues": ["All", "Headers", "No Headers", "Columns Headers", "Rows Headers"]
					}
				}
			} else {
				this.elementFields[rule] = {
					...this.elementFields[rule],
					...{
						"Value": "TextField",
						"List": "TextField",
						"Expand": "TextField",
						"Enum": "TextField"
					}
				}
			}
		});
	}

	// TODO update localStorage if update rules

	@action
	clearRuleStorage () {
		const rulesStorage = window.localStorage;
		rulesStorage.removeItem(this.rulesStorageName);
		this.rules = JSON.parse(JSON.stringify(RulesJson));
		rulesStorage.setItem(this.rulesStorageName, JSON.stringify(RulesJson));
	}

	@action
	changeListOfAttr (value, index) {
		const copy = this.rules.ListOfSearchAttributes.slice();
		copy[index] = value;
		this.rules.ListOfSearchAttributes = copy;
		this.updateRules();
	}

	@action
	deleteItemFromListOfAttr (index) {
		const copy = this.rules.ListOfSearchAttributes.slice();
		copy.splice(index, 1);
		this.rules.ListOfSearchAttributes = copy;
		this.updateRules();
	}

	@action
	addItemToListOfAttr (value) {
		const copy = this.rules.ListOfSearchAttributes.slice();
		copy.push(value);
		this.rules.ListOfSearchAttributes = copy;
		this.updateRules();
	}

	updateRules () {
		const rulesStorage = window.localStorage;
		rulesStorage.setItem(this.rulesStorageName, JSON.stringify(this.rules));
	}

	@action
	setCurrentRuleName (rule) {
		this.currentRuleName = rule;
	}

	@action
	setCurrentRuleSet (ruleSet) {
		this.currentRuleSet = ruleSet;
		this.currentRuleItem = 0;
		this.currentRuleName = '';
	}

	@action
	handleSwitchRule (index) {
		this.currentRuleItem = index;
	}

	@action
	handleAddRuleItem () {
		const currentRules =  this.rules[this.currentRuleSet][this.currentRuleName].slice();
		const rule = currentRules.slice(-1)[0];
		const newRule = {};

		if (rule.Locator || rule.Root) {
			Object.keys(rule).forEach(prop => {
				newRule[prop] = '';
			});
			newRule.id = rule.id + 1;
			currentRules.push(newRule);
			this.currentRuleItem = this.rules[this.currentRuleSet][this.currentRuleName].length;
			this.rules[this.currentRuleSet][this.currentRuleName] = currentRules.slice();
			this.updateRules();
		}
	}

	@action
	handleDeleteRuleItem (index) {
		const currentRules =  this.rules[this.currentRuleSet][this.currentRuleName].slice();
		if (currentRules.length > 1) {
			currentRules.splice(index, 1);
			this.rules[this.currentRuleSet][this.currentRuleName] = currentRules.slice();
			this.updateRules();
		}
	}

	@action
	handleEditRuleName(value, field) {
		const currentRules =  this.rules[this.currentRuleSet][this.currentRuleName].slice();
		currentRules[this.currentRuleItem][field] = value;
		this.rules[this.currentRuleSet][this.currentRuleName] = currentRules.slice();
		this.updateRules();
	}

	// TODO edit rule name e.g Button
	// TODO copy rule e.g Button
	// TODO delete rule e.g Button
	// TODO add new rule for unknown item next generation
}
