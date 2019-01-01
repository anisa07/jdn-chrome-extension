import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import { inject, observer } from "mobx-react";
import Button from '../../../components/Button/Button';
import Infinity from '../../../components/Infinity/Infinity';
import { importIcon } from '../../../../icons/index';

const styles = {
	buttonContainer: {
		padding: '10px 0 0 0',
		display: 'flex',
		flexDirection: 'column'
	},
	btn: {
		margin: '0 10px 10px 0',
		padding: '5px',
		width: '35px'
	},
};

@inject('mainModel')
@observer
class GenerateResults extends React.Component {
	handleDownloadSiteCode = () => {
		const { mainModel } = this.props;

		mainModel.conversionModel.clearOldConversion();
		mainModel.generateBlockModel.pages.forEach(p => {
			mainModel.conversionModel.genPageCode(p, mainModel);
		});
		mainModel.conversionModel.zipAllCode(mainModel);
	};

	handleDownloadPageCode = (page, index) => {
		const { mainModel } = this.props;

		mainModel.conversionModel.genPageCode(page, mainModel);
		mainModel.conversionModel.setCurrentPageCode(index);
		mainModel.conversionModel.downloadPageCode(page, mainModel.settingsModel.extension);
	};

	render () {
		const { classes, mainModel } = this.props;
		const pages = mainModel.generateBlockModel.pages || [];
		const pageReady = !!pages.length;

		return (
			<div className={classes.buttonContainer}>
				{ pageReady ?
						<div>
							<Button className={classes.btn} icon={importIcon} onclick={this.handleDownloadSiteCode}/>
							<span>{`Download site ${mainModel.generateBlockModel.siteInfo.siteTitle}`}</span>
						</div> : <Infinity size={{height: '40px', width: '40px'}} color={'#6f42c1'} />
				}
				{ pageReady ?
						pages.map((page, index) =>
							(
								<div key={page.id}>
									<Button className={classes.btn} icon={importIcon} onclick={() => {this.handleDownloadPageCode(page, index)}}/>
									<span>{`Download page ${page.name}`}</span>
								</div>
							)
						)
					: <Infinity size={{height: '40px', width: '40px'}} color={'#6f42c1'} />
				}
			</div>
		)
	}
}

GenerateResults.propTypes = {};

const GenerateResultsWrapper = injectSheet(styles)(GenerateResults);

export default GenerateResultsWrapper;
