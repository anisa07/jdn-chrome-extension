import React from 'react';
import ReactDOM from 'react-dom';
import injectSheet from 'react-jss';
import MediaQuery from 'react-responsive';
import { observer, Provider } from 'mobx-react';
import PropTypes from 'prop-types';
import ScreenSizes from './utils/screen-dimesions';
import GenerateBlockWrapper from './blocks/generate/GenerateBlock';
import { TabsBlockWrapper, LeftBlockWrapper, RightBlockWrapper } from './blocks/tabs/Tabs';
import MainModel from './models/MainModel';

const styles = {
	commonContainer: {
		height: '100vh'
	},
	contentContainerDesktopTablet: {
		display: 'flex',
		flexGrow: 1,
		marginLeft: '42px',
		height: '100vh'
	},
	contentContainerMobile: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		minHeight: '400px'
	}
};

// const Component = mainModel.ApplicationMap.get(mainModel.currentTab).component;
@observer
class App extends React.Component {
	mainModel = new MainModel();

	render () {
		const { classes } = this.props;
		const ComponentLeft = this.mainModel.ApplicationMap.get(this.mainModel.currentTab).componentLeft;

		return (
			<Provider mainModel={this.mainModel}>
				<div className={classes.commonContainer}>
					<TabsBlockWrapper/>
					<MediaQuery minWidth={ScreenSizes.tablet}>
						<div className={classes.contentContainerDesktopTablet}>
							<LeftBlockWrapper><ComponentLeft /></LeftBlockWrapper>
							<RightBlockWrapper><p>RightBlock</p></RightBlockWrapper>
						</div>
					</MediaQuery>
					<MediaQuery maxWidth={ScreenSizes.tablet}>
						<div className={classes.contentContainerMobile}>
							<LeftBlockWrapper><ComponentLeft /></LeftBlockWrapper>
							<RightBlockWrapper><p>RightBlock</p></RightBlockWrapper>
						</div>
					</MediaQuery>
				</div>
			</Provider>
		)
	}
}

const AppWrapper = injectSheet(styles)(App);

const div = document.getElementById("chromeExtensionReactApp");
ReactDOM.render(<AppWrapper/>, div);
