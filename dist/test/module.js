'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnnotationsQueryCtrl = exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _datasource = require('./datasource');

var _query_ctrl = require('./query_ctrl');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TeamCityConfigCtrl = function TeamCityConfigCtrl() {
    _classCallCheck(this, TeamCityConfigCtrl);
};

TeamCityConfigCtrl.templateUrl = 'partials/config.html';

var TeamCityQueryOptionsCtrl = function TeamCityQueryOptionsCtrl() {
    _classCallCheck(this, TeamCityQueryOptionsCtrl);
};

TeamCityQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

var TeamCityAnnotationsQueryCtrl = function TeamCityAnnotationsQueryCtrl() {
    _classCallCheck(this, TeamCityAnnotationsQueryCtrl);
};

TeamCityAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

exports.Datasource = _datasource.TeamCityDatasource;
exports.QueryCtrl = _query_ctrl.TeamCityDatasourceQueryCtrl;
exports.ConfigCtrl = TeamCityConfigCtrl;
exports.QueryOptionsCtrl = TeamCityQueryOptionsCtrl;
exports.AnnotationsQueryCtrl = TeamCityAnnotationsQueryCtrl;
//# sourceMappingURL=module.js.map
