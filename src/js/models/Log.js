import { observable, action } from 'mobx';

export default class Log {
	@observable log = '';

	isEmpty() {
		this.log.length ? false : true;
	}

	@action
	addToLog(log) {
		this.log = this.isEmpty() ? log : `${this.log} \n${log}`;
	}

	@action
	clearLog() {
		this.log = '';
	}
}
