import { observable, action } from 'mobx';

export default class SettingsModel {
	@observable downloadAfterGeneration = false;
	@observable extension = '.java';
}
