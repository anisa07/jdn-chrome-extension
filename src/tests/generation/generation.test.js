import { generationCallBack } from '../../js/models/GenerateBlockModel';
import { mainModelMock } from '../data/MainModelMock';
import { homePage } from '../data/home';
import { homePageExpected } from '../data/expected';

describe('Generation Home elements and sections', () => {
	beforeAll(() => {
		const { generateBlockModel } = mainModelMock;

		generateBlockModel.page.id = '';
		generateBlockModel.page.name = 'testName';
		generateBlockModel.page.title = 'testTitle';
		generateBlockModel.page.url = 'testUrl';
		generateBlockModel.page.package = 'testPackage';

		generateBlockModel.siteInfo = {
			hostName: 'testHostName',
			siteTitle: 'testSiteTitle',
			origin: 'testOrigin',
			domainName: 'testDomainName',
			pack: 'testPack'
		};
		generationCallBack({ mainModel: mainModelMock }, homePage, null);
	});

	it(`should generate ${homePageExpected.page.elements.length} elements`, () => {
		expect(mainModelMock.generateBlockModel.page.elements.length).toEqual(homePageExpected.page.elements.length);
	});

});
