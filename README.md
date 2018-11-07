# TeamCity Data Source for Grafana

TeamCity Data Source plugin provides information about TeamCity builds.

## Features

* Support TeamCity builds
    * Search by build type id
    * Display data from fields: status, statusText, buildNumber, buildTypeName, projectName
* TeamCity Basic Authentication

## Configure

1. Select TeamCity from the Type dropdown.
1. In the name field, fill in a name for the data source. It can be anything.
1. In the URL field, enter TeamCity URL, e.g. http://teamcity:8080
1. Enable "Basic Auth" flag.
1. Paste username and password into appropriate fields in Basic Auth Details section.
1. Test that the configuration details are correct by clicking on the "Save & Test" button

![Configure](https://raw.githubusercontent.com/avalarin/grafana-teamcity-datasource/master/dist/img/plugin_configure.png)