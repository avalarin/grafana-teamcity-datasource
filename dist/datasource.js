'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TeamCityDatasource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TeamCityDatasource = exports.TeamCityDatasource = function () {
    function TeamCityDatasource(instanceSettings, $q, backendSrv, templateSrv) {
        _classCallCheck(this, TeamCityDatasource);

        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;
        this.q = $q;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = { 'Content-Type': 'application/json' };
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
        }

        this.targetTypes = ['build'];
        this.fields = {
            build: ['status', 'statusText', 'number', 'name', 'projectName']
        };
    }

    _createClass(TeamCityDatasource, [{
        key: 'testDatasource',
        value: function testDatasource() {
            return this.getBuildTypes().then(function () {
                return { status: 'success', message: 'Data source is working', title: 'Success' };
            });
        }
    }, {
        key: 'metricFindQuery',
        value: function metricFindQuery(target, query) {
            if (this.targetTypes.indexOf(target.type) == -1) {
                return Promise.reject({ status: 'error', message: 'metricFindQuery: Unknown target type ' + target.type });
            }
            if (target.type == 'build') {
                return this.getBuildTypes().then(function (types) {
                    return types.filter(function (type) {
                        return type.id.indexOf(query) != -1;
                    }).map(function (type) {
                        return { text: type.id, value: type.id };
                    });
                });
            }
            return Promise.reject({ status: 'error', message: 'metricFindQuery: Unexpected state' });
        }
    }, {
        key: 'query',
        value: function query(options) {
            var _this = this;

            var promises = options.targets.map(function (target) {
                return _this.queryOneTarget(options, target);
            });

            return Promise.all(promises).then(function (results) {
                return { data: [].concat.apply([], results) };
            });
        }
    }, {
        key: 'queryOneTarget',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(queryOptions, target) {
                var _this2 = this;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(this.targetTypes.indexOf(target.type) == -1)) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt('return', Promise.reject({ status: 'error', message: 'queryOneTarget: Unknown target type ' + target.type }));

                            case 2:
                                if (!(this.fields[target.type].indexOf(target.field) == -1)) {
                                    _context.next = 4;
                                    break;
                                }

                                return _context.abrupt('return', Promise.reject({ status: 'error', message: 'queryOneTarget: Unknown field ' + target.field }));

                            case 4:
                                if (!(target.type == 'build')) {
                                    _context.next = 6;
                                    break;
                                }

                                return _context.abrupt('return', this.getBuilds({
                                    buildType: target.target,
                                    count: queryOptions.maxDataPoints,
                                    from: queryOptions.range.from,
                                    to: queryOptions.range.to
                                }).then(function (builds) {
                                    return _this2.mapResult(target, builds);
                                }));

                            case 6:
                                return _context.abrupt('return', Promise.reject({ status: 'error', message: 'queryOneTarget: Unexpected state' }));

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function queryOneTarget(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return queryOneTarget;
        }()
    }, {
        key: 'mapResult',
        value: function mapResult(target, items) {
            return {
                target: target.target,
                datapoints: items.map(function (item) {
                    return [item[target.field], item.date];
                }).sort(function (a, b) {
                    return a[1] > b[1];
                })
            };
        }
    }, {
        key: 'getBuilds',
        value: function getBuilds(request) {
            var from = encodeURIComponent((0, _moment2.default)(request.from).format("YYYYMMDDTHHmmssZ"));
            var to = encodeURIComponent((0, _moment2.default)(request.to).format("YYYYMMDDTHHmmssZ"));
            var url = this.url + '/httpAuth/app/rest/builds?' + ('locator=buildType:(' + escapeBuildTypeId(request.buildType) + '),count:' + parseInt(request.count) + ',') + ('finishDate:(date:' + from + ',condition:after),finishDate:(date:' + to + ',condition:before)&') + 'fields=build(number,status,statusText,finishDate,buildType(name,projectName))';
            return this.doRequest({
                url: url,
                method: 'GET'
            }).then(function (result) {
                return result.data.build.map(function (build) {
                    return {
                        number: build.number,
                        status: build.status == 'SUCCESS' ? 100 : 0,
                        statusText: build.statusText,
                        date: (0, _moment2.default)(build.finishDate, 'YYYYMMDDTHHmmssZ').unix() * 1000,
                        name: build.buildType.name,
                        projectName: build.buildType.projectName
                    };
                });
            });
        }
    }, {
        key: 'getBuildTypes',
        value: function getBuildTypes() {
            var url = this.url + '/httpAuth/app/rest/buildTypes?fields=buildType(id,name,projectName,projectId)';
            return this.doRequest({
                url: url,
                method: 'GET'
            }).then(function (result) {
                return result.data.buildType.map(function (type) {
                    return {
                        id: type.id,
                        name: type.name,
                        projectId: type.projectId,
                        projectName: type.projectName
                    };
                });
            });
        }
    }, {
        key: 'doRequest',
        value: function doRequest(options) {
            options.withCredentials = this.withCredentials;
            options.headers = this.headers;

            return this.backendSrv.datasourceRequest(options);
        }
    }]);

    return TeamCityDatasource;
}();

function escapeBuildTypeId(id) {
    return id.replace(/[^a-zA-Z0-9_]+/g, '_');
}
//# sourceMappingURL=datasource.js.map
