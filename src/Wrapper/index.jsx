'use strict';

var React = require('react')
var PropTypes = require('prop-types')
var createClass = require('create-react-class')
var assign = require('object-assign')
var Scroller = require('react-virtual-scroller2')

function emptyFn(){}

module.exports = createClass({

    displayName: 'ReactDataGrid.Wrapper',

    propTypes: {
        scrollLeft   : PropTypes.number,
        scrollTop    : PropTypes.number,
        scrollbarSize: PropTypes.number,
        rowHeight   : PropTypes.any,
        renderCount : PropTypes.number
    },

    getDefaultProps: function(){
        return {
            scrollLeft: 0,
            scrollTop : 0
        }
    },

    onMount: function(scroller){
        ;(this.props.onMount || emptyFn)(this, scroller)
    },

    render: function() {

        var props     = this.prepareProps(this.props)
        var rowsCount = props.renderCount

        var groupsCount = 0
        if (props.groupData){
            groupsCount = props.groupData.groupsCount
        }

        rowsCount += groupsCount

        // var loadersSize = props.loadersSize
        var verticalScrollerSize = (props.totalLength + groupsCount) * props.rowHeight// + loadersSize

        var content = props.empty?
            <div className="z-empty-text" style={props.emptyTextStyle}>{props.emptyText}</div>:
            <div {...props.tableProps} ref={el => this.table = el}/>


        return <Scroller
                onMount={this.onMount}
                preventDefaultHorizontal={true}

                loadMask={!props.loadMaskOverHeader}
                loading={props.loading}

                scrollbarSize={props.scrollbarSize}

                minVerticalScrollStep={props.rowHeight}
                scrollTop={props.scrollTop}
                scrollLeft={props.scrollLeft}

                scrollHeight={verticalScrollerSize}
                scrollWidth={props.minRowWidth}

                onVerticalScroll={this.onVerticalScroll}
                onHorizontalScroll={this.onHorizontalScroll}
            >
            {content}
        </Scroller>
    },

    onVerticalScrollOverflow: function() {
    },

    onHorizontalScrollOverflow: function() {
    },

    onHorizontalScroll: function(scrollLeft) {
        this.props.onScrollLeft(scrollLeft)
    },

    onVerticalScroll: function(pos){
        this.props.onScrollTop(pos)
    },

    prepareProps: function(thisProps){
        var props = {}

        assign(props, thisProps)

        return props
    }
})
