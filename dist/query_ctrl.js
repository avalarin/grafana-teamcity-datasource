'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TeamCityDatasourceQueryCtrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('app/plugins/sdk');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TeamCityDatasourceQueryCtrl = exports.TeamCityDatasourceQueryCtrl = function (_QueryCtrl) {
  _inherits(TeamCityDatasourceQueryCtrl, _QueryCtrl);

  function TeamCityDatasourceQueryCtrl($scope, $injector) {
    _classCallCheck(this, TeamCityDatasourceQueryCtrl);

    var _this = _possibleConstructorReturn(this, (TeamCityDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(TeamCityDatasourceQueryCtrl)).call(this, $scope, $injector));

    _this.scope = $scope;
    _this.target.target = _this.target.target || 'select metric';
    _this.target.type = _this.target.type || 'build';
    _this.target.field = _this.target.field || 'status';
    return _this;
  }

  _createClass(TeamCityDatasourceQueryCtrl, [{
    key: 'getOptions',
    value: function getOptions(query) {
      return this.datasource.metricFindQuery(this.target, query || '');
    }
  }, {
    key: 'toggleEditorMode',
    value: function toggleEditorMode() {
      this.target.rawQuery = !this.target.rawQuery;
    }
  }, {
    key: 'onChangeInternal',
    value: function onChangeInternal() {
      this.panelCtrl.refresh();
    }
  }]);

  return TeamCityDatasourceQueryCtrl;
}(_sdk.QueryCtrl);

TeamCityDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
//# sourceMappingURL=query_ctrl.js.map
