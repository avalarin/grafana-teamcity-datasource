import {QueryCtrl} from 'app/plugins/sdk';

export class TeamCityDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector)  {
    super($scope, $injector);

    this.scope = $scope;
    this.target.target = this.target.target || 'select metric';
    this.target.type = this.target.type || 'build';
    this.target.field = this.target.field || 'status';
  }

  getOptions(query) {
    return this.datasource.metricFindQuery(this.target, query || '');
  }

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}

TeamCityDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';