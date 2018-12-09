import { observable, action } from 'mobx';
import GenerateBlockModel from './GenerateBlockModel';
import RulesBlockModel from './RulesBlockModel';
import GenerateBlockWrapper from '../blocks/generate/GenerateBlock'
import GenerateResultsWrapper from '../blocks/generateResults/GenerateResults'
import RulesBlockWrapper from '../blocks/rules/RulesBlock'
import ListOfSearchAttributesWrapper from '../blocks/listOfSearchAttributes/ListOfSearchAttributes'
import RuleForElementWrapper from '../blocks/ruleForElement/RuleForElement'
import ConversionToCodeModel from './ConversionToCodeModel'
import SettingsModel from './SettingsModel'

export default class MainModel {
	@observable generateBlockModel;
	@observable conversionModel;
	@observable settingsModel;
	@observable ruleBlockModel;
	@observable currentTab = 2;
	@observable currentRightPart = '';
	@observable currentPageId;
	ApplicationMap = new Map();

	constructor () {
		this.generateBlockModel = new GenerateBlockModel();
		this.ruleBlockModel = new RulesBlockModel();
		this.conversionModel = new ConversionToCodeModel();
		this.settingsModel = new SettingsModel();

		this.ApplicationMap.set(2, {
			componentLeft: GenerateBlockWrapper,
			tabName: 'Generate',
			componentsRight: { GenerateResultsWrapper }
		});
		this.ApplicationMap.set(1,
			{
				componentLeft: RulesBlockWrapper,
				tabName: 'Rules',
				componentsRight: {
					ListOfSearchAttributesWrapper: ListOfSearchAttributesWrapper,
					RuleForElementWrapper: RuleForElementWrapper
				}
			});
		this.ApplicationMap.set(0, { componentLeft: '', tabName: 'Manage', componentsRight: {} });
	}

	@action
	switchTab (tab) {
		this.currentTab = tab;
		this.currentRightPart = '';
	}

	@action
	setRightPart (part, currentRule, ruleSet) {
		this.currentRightPart = part ? part : '';
		ruleSet ? this.ruleBlockModel.setCurrentRuleSet(ruleSet) : this.ruleBlockModel.setCurrentRuleSet('');
		currentRule ? this.ruleBlockModel.setCurrentRuleName(currentRule) : this.ruleBlockModel.setCurrentRuleName('');
	}

	@action
	setPageId (id) {
		this.currentPageId = id;
	}
}
