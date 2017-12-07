'use strict';

var React  = require('react')
var DOM = require('react-dom-factories')
var createClass = require('create-react-class')
var PropTypes = require('prop-types')
var assign = require('object-assign')
var normalize = require('react-style-normalizer')

var TEXT_ALIGN_2_JUSTIFY = {
    right : 'flex-end',
    center: 'center'
}

function copyProps(target, source, list){

    list.forEach(function(name){
        if (name in source){
            target[name] = source[name]
        }
    })

}

var Cell = createClass({

    displayName: 'ReactDataGrid.Cell',

    propTypes: {
        className     : PropTypes.string,
        firstClassName: PropTypes.string,
        lastClassName : PropTypes.string,

        contentPadding: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),

        column : PropTypes.object,
        columns: PropTypes.array,
        index  : PropTypes.number,

        style      : PropTypes.object,
        text       : PropTypes.any,
        rowIndex   : PropTypes.number
    },

    getDefaultProps: function(){
        return {
            text: '',

            firstClassName: 'z-first',
            lastClassName : 'z-last',

            defaultStyle: {}
        }
    },

    prepareClassName: function(props) {
        var index     = props.index
        var columns   = props.columns
        var column    = props.column

        var textAlign = column && column.textAlign

        var className = props.className || ''

        className += ' ' + Cell.className

        if (columns){
            if (!index && props.firstClassName){
                className += ' ' + props.firstClassName
            }

            if (index == columns.length - 1 && props.lastClassName){
                className += ' ' + props.lastClassName
            }
        }

        if (textAlign){
            className += ' z-align-' + textAlign
        }

        return className
    },

    prepareStyle: function(props) {
        var column    = props.column
        var sizeStyle = column && column.sizeStyle

        var alignStyle
        var textAlign = (column && column.textAlign) || (props.style || {}).textAlign

        if (textAlign){
            alignStyle = { justifyContent: TEXT_ALIGN_2_JUSTIFY[textAlign] }
        }

        var style = assign({}, props.defaultStyle, sizeStyle, alignStyle, props.style)

        return normalize(style)
    },

    prepareProps: function(thisProps){
      var props = assign({}, thisProps)

      if (!props.column && props.columns){
        props.column  = props.columns[props.index]
      }

      props.className = this.prepareClassName(props)
      props.style     = this.prepareStyle(props)

      // TODO: this is dumb... should be { ...rest }
      delete props.columns
      delete props.index
      delete props.header
      delete props.firstClassName
      delete props.lastClassName
      delete props.defaultStyle

      return props
    },

    render: function(){
      var props = this.p = this.prepareProps(this.props)

      var {
        column, contentPadding, renderText, text, rowIndex, renderCell, ...rest
      } = props

      var textAlign = column && column.textAlign
      var text = renderText ? renderText(text, column, rowIndex) : text

      var contentProps = {
        className: 'z-content',
        style: {
          padding: contentPadding
        }
      }

      var content = renderCell ? renderCell(contentProps, text, props) :
        DOM.div(contentProps, text)

        delete rest.data

        return (
            <div {...rest}>
                {content}
                {props.children}
            </div>
        )
    }
})

Cell.className = 'z-cell'

module.exports = Cell
