import { observable, action } from 'mobx';
import GenerateBlockModel from './GenerateBlockModel';
import RulesBlockModel from './RulesBlockModel';
import GenerateBlockWrapper from '../blocks/generate/GenerateBlock'

export default class MainModel {
	@observable generateBlockModel;
	@observable ruleBlockModel;
	@observable currentTab = 2;
	ApplicationMap = new Map();

	constructor () {
		this.generateBlockModel = new GenerateBlockModel();
		this.ruleBlockModel = new RulesBlockModel();
		this.ApplicationMap.set(2, {componentLeft: GenerateBlockWrapper, tabName: 'Generate'});
		this.ApplicationMap.set(1, {componentLeft: GenerateBlockWrapper, tabName: 'Rules'});
		this.ApplicationMap.set(0, {componentLeft: GenerateBlockWrapper, tabName: 'Manage'});
	}

	@action
	switchTab(tab) {
		this.currentTab = tab;
	}
}
