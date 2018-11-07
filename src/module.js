import {TeamCityDatasource} from './datasource';
import {TeamCityDatasourceQueryCtrl} from './query_ctrl';

class TeamCityConfigCtrl {}
TeamCityConfigCtrl.templateUrl = 'partials/config.html';

class TeamCityQueryOptionsCtrl {}
TeamCityQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

class TeamCityAnnotationsQueryCtrl {}
TeamCityAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html'

export {
    TeamCityDatasource as Datasource,
    TeamCityDatasourceQueryCtrl as QueryCtrl,
    TeamCityConfigCtrl as ConfigCtrl,
    TeamCityQueryOptionsCtrl as QueryOptionsCtrl,
    TeamCityAnnotationsQueryCtrl as AnnotationsQueryCtrl
};