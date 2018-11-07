import moment from 'moment'

export class TeamCityDatasource {

    constructor(instanceSettings, $q, backendSrv, templateSrv) {
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;
        this.q = $q;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = {'Content-Type': 'application/json'};
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
          this.headers['Authorization'] = instanceSettings.basicAuth;
        }

        this.targetTypes = [ 'build' ]
        this.fields = {
            build: [ 'status', 'statusText', 'number', 'name', 'projectName' ]
        }
      }

    testDatasource() {
        return this.getBuildTypes()
            .then(() => ({ status: 'success', message: 'Data source is working', title: 'Success' }))
    }

    metricFindQuery(target, query) {
        if (this.targetTypes.indexOf(target.type) == -1) {
            return Promise.reject({ status: 'error', message: `metricFindQuery: Unknown target type ${target.type}` })
        }
        if (target.type == 'build') {
            return this.getBuildTypes().then(types =>
                types
                    .filter(type => type.id.indexOf(query) != -1)
                    .map(type => ({ text: type.id, value: type.id }))
            )
        }
        return Promise.reject({ status: 'error', message: `metricFindQuery: Unexpected state` })
    }

    query(options) {
        var promises = options.targets
            .map(target => this.queryOneTarget(options, target))
        
        return Promise.all(promises).then(results => ({ data: [].concat.apply([], results) }))
    }

    async queryOneTarget(queryOptions, target) {
        if (this.targetTypes.indexOf(target.type) == -1) {
            return Promise.reject({ status: 'error', message: `queryOneTarget: Unknown target type ${target.type}` })
        }
        if (this.fields[target.type].indexOf(target.field) == -1) {
            return Promise.reject({ status: 'error', message: `queryOneTarget: Unknown field ${target.field}` })
        }
        if (target.type == 'build') {
            return this.getBuilds({
                buildType: target.target,
                count: queryOptions.maxDataPoints,
                from: queryOptions.range.from,
                to: queryOptions.range.to
            }).then(builds => this.mapResult(target, builds))
        }
        return Promise.reject({ status: 'error', message: `queryOneTarget: Unexpected state` })
    }

    mapResult(target, items) {
        return { 
            target: target.target,
            datapoints: items.map(item => [item[target.field], item.date])
                              .sort((a, b) => a[1] > b[1])
        }
    }

    getBuilds(request) {
        var from = encodeURIComponent(moment(request.from).format("YYYYMMDDTHHmmssZ"))
        var to = encodeURIComponent(moment(request.to).format("YYYYMMDDTHHmmssZ"))
        var url = `${this.url}/httpAuth/app/rest/builds?`
            + `locator=buildType:(${escapeBuildTypeId(request.buildType)}),count:${parseInt(request.count)},`
            + `finishDate:(date:${from},condition:after),finishDate:(date:${to},condition:before)&`
            + 'fields=build(number,status,statusText,finishDate,buildType(name,projectName))'
        return this.doRequest({
            url: url,
            method: 'GET'
        }).then(result => {
            return result.data.build.map(build => ({
                number: build.number,
                status: build.status == 'SUCCESS' ? 100 : 0,
                statusText: build.statusText,
                date: moment(build.finishDate, 'YYYYMMDDTHHmmssZ').unix() * 1000,
                name: build.buildType.name,
                projectName: build.buildType.projectName
            }))
        })
    }

    getBuildTypes() {
        var url = `${this.url}/httpAuth/app/rest/buildTypes?fields=buildType(id,name,projectName,projectId)`
        return this.doRequest({
            url: url,
            method: 'GET'
        }).then(result => {
            return result.data.buildType.map(type => ({
                id: type.id,
                name: type.name,
                projectId: type.projectId,
                projectName: type.projectName
            }))
        })
    }

    doRequest(options) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
    
        return this.backendSrv.datasourceRequest(options)
      }

}

function escapeBuildTypeId(id) {
    return id.replace(/[^a-zA-Z0-9_]+/g,'_')
}