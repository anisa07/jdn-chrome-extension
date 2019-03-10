import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import { inject, observer } from "mobx-react";
import Button from '../../../components/Button/Button';
import { settings } from '../../../../icons/index';

const styles = {
	generateStyle: {
		margin: '10px 0 10px 10px'
	}
};

@inject('mainModel')
@observer
class GenerateBlock extends React.Component {
	handleGenerate = () => {
		const { mainModel } = this.props;

		mainModel.generateBlockModel.generate(mainModel);
		mainModel.setRightPart('GenerateResultsWrapper');
	};

	handleGenerateSeveral = () => {
		const { mainModel } = this.props;

		mainModel.generateBlockModel.generateSeveralPages(mainModel);
		mainModel.setRightPart('GenerateResultsWrapper');
	};

	handleOpenSettings = () => {
		const { mainModel } = this.props;

		mainModel.setLeftPart('GenerateSettingsWrapper');
		mainModel.setRightPart('GeneralSettingsWrapper');
	};

	render () {
		const { classes } = this.props;
		return (
			<div>
				<div className={`${classes.generateStyle} BtnGroup`}>
					<Button
						className='BtnGroup-item btn-primary'
						label={'Generate'}
						onclick={this.handleGenerate}
					/>
					<Button
						className='BtnGroup-item'
						icon={settings}
						onclick={this.handleOpenSettings}
					/>
				</div>
				<div className={`${classes.generateStyle}`}>
					<Button
						className='BtnGroup-item btn-primary'
						label={'Generate PO for Several Pages'}
						onclick={this.handleGenerateSeveral}
					/>
				</div>
			</div>
		)
	}
}

GenerateBlock.propTypes = {};

const GenerateBlockWrapper = injectSheet(styles)(GenerateBlock);

export default GenerateBlockWrapper;
