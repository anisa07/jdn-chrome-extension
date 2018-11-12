import React from 'react';

import PropTypes from 'prop-types';

class Button extends React.Component {
	handleClick = () => {
		const {onclick} = this.props;
		if (onclick) {
			this.props.onclick();
		}
	};

	render () {
		const { label, className, icon } = this.props;
		let cl = `btn ${className}`;
		return (
			<button className={cl} type="button" onClick={this.handleClick}>
				<span className='buttonLabel'>{label} </span>
				{ icon &&	<img className='icon' src={icon} /> }
			</button>
		)
	}
}

Button.propTypes = {};

export default Button;
