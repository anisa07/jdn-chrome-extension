import { observable, action } from 'mobx';
import RulesJson from '../json/rules';

export default class RulesBlockModel {
	@observable rules;
	rulesStorageName = 'JDNElementRules';

	constructor () {
		const rulesStorage = window.localStorage;
		const rulesFromStorage = rulesStorage.getItem(this.rulesStorageName);

		if (rulesFromStorage) {
			this.rules = JSON.parse(rulesFromStorage);
		} else {
			this.rules = JSON.parse(JSON.stringify(RulesJson));
			rulesStorage.setItem(this.rulesStorageName, JSON.stringify(RulesJson));
		}
	}

	// @TODO update localStorage if update rules

	@action
	clearStorage() {
		const rulesStorage = window.localStorage;
		rulesStorage.removeItem(this.rulesStorageName);
		this.rules = JSON.parse(JSON.stringify(RulesJson));
		rulesStorage.setItem(this.rulesStorageName, JSON.stringify(RulesJson));
	}
}
