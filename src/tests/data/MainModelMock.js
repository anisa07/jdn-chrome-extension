import MainModel from '../../js/models/MainModel';
import { rules } from './rules';

const mainModelMock = new MainModel();
mainModelMock.ruleBlockModel.rules = rules;

export { mainModelMock };
