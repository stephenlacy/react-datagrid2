'use strict';

var React = require('react');

var Row = require('../Row');
var Cell = require('../Cell');
var CellFactory = React.createFactory(Cell);

var renderRow = require('./renderRow');

function renderData(props, data, depth, initialCounter) {

    return data.map(function (data, index) {

        return renderRow.call(this, props, data, index + initialCounter, function (config) {
            config.cellFactory = function (cellProps) {
                if (cellProps.index === 0) {
                    cellProps.style.paddingLeft = depth * props.groupNestingWidth;
                }

                var factory = props.cellFactory || CellFactory;

                return factory(cellProps);
            };

            config.className += ' z-grouped';

            return config;
        });
    }.bind(this));
}

function renderGroupRow(props, groupData) {

    var cellStyle = {
        minWidth: props.totalColumnWidth,
        paddingLeft: (groupData.depth - 1) * props.groupNestingWidth
    };

    return React.createElement(
        Row,
        { className: 'z-group-row', key: 'group-' + groupData.valuePath, rowHeight: props.rowHeight },
        React.createElement(Cell, {
            className: 'z-group-cell',
            contentPadding: props.cellPadding,
            text: groupData.value,
            style: cellStyle
        })
    );
}

function renderGroup(props, groupData, initial) {

    var result = [renderGroupRow(props, groupData)];

    if (groupData && groupData.leaf) {
        result.push.apply(result, renderData.call(this, props, groupData.data, groupData.depth, initial));
    } else {
        groupData.keys.forEach(function (key) {
            var items = renderGroup.call(this, props, groupData.data[key], initial);
            result.push.apply(result, items);
        });
    }

    return result;
}

function renderGroups(props, groupsData, initial) {

    if (!initial) initial = 0;

    var result = [];

    groupsData.keys.map(function (key) {
        result.push.apply(result, renderGroup.call(this, props, groupsData.data[key], initial));
        initial += groupsData.data[key].data.length;
    }.bind(this));

    return result;
}

module.exports = function (props, groupData) {
    return renderGroups.call(this, props, groupData);
};