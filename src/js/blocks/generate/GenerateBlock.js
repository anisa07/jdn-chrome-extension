import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import Button from '../../components/Button/Button';
import { settings } from '../../../icons/index';


const styles = {
	generateStyle: {
		margin: '10px 0 10px 10px'
	}
};

class GenerateBlock extends React.Component {
	render () {
		const { classes } = this.props;
		return (
			<div>
				<div className={`${classes.generateStyle} BtnGroup`}>
					<Button className='BtnGroup-item btn-primary' label={'Generate'}/>
					<Button className='BtnGroup-item' icon={settings}/>
				</div>
			</div>
		)
	}
}

GenerateBlock.propTypes = {};

const GenerateBlockWrapper = injectSheet(styles)(GenerateBlock);

export default GenerateBlockWrapper;
