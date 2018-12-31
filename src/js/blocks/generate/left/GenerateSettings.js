import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import { inject, observer } from "mobx-react";
import Button from '../../../components/Button/Button';
import { back } from '../../../../icons/index';


const styles = {
	generateStyle: {
		margin: '10px 0 10px 10px'
	}
};

@inject('mainModel')
@observer
class GenerateSettings extends React.Component {
	handleSettings = () => {
		const { mainModel } = this.props;

		mainModel.setRightPart('GeneralSettingsWrapper');
	};

	handleBack = () => {
		const { mainModel } = this.props;

		mainModel.setLeftPart('GenerateBlockWrapper');
		if (mainModel.generateBlockModel.pages.length) {
			mainModel.setRightPart('GenerateResultsWrapper');
		} else {
			mainModel.setRightPart();
		}
	};

	render () {
		const { classes } = this.props;
		return (
			<div className={`${classes.generateStyle} BtnGroup`}>
				<Button
					className='BtnGroup-item'
					icon={back}
					onclick={this.handleBack}
				/>
				<Button
					className='BtnGroup-item'
					label={'Settings'}
					onclick={this.handleSettings}/>
			</div>
		)
	}
}

GenerateSettings.propTypes = {};

const GenerateSettingsWrapper = injectSheet(styles)(GenerateSettings);

export default GenerateSettingsWrapper;
