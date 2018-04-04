/* @flow */
import objectEach from 'fast-loops/lib/objectEach'
import arrayEach from 'fast-loops/lib/arrayEach'
import isPlainObject from 'isobject'
import removeUndefinedPlugin from 'fela-plugin-remove-undefined'

import type { StyleType } from '../../../flowtypes/StyleType'
import type { DOMRenderer } from '../../../flowtypes/DOMRenderer'
import type { NativeRenderer } from '../../../flowtypes/NativeRenderer'

const removeUndefined = removeUndefinedPlugin()

function extendStyle(
  style: Object,
  extension: Object,
  extendPlugin: Function,
  type: StyleType,
  renderer: DOMRenderer | NativeRenderer
): void {
  // extend conditional style objects
  if (extension.hasOwnProperty('condition')) {
    if (extension.condition) {
      renderer._mergeStyle(style, extendPlugin(extension.style, type, renderer))
    }
  } else {
    // extend basic style objects
    renderer._mergeStyle(style, removeUndefined(extension))
  }
}

function extend(
  style: Object,
  type: StyleType,
  renderer: DOMRenderer | NativeRenderer
): Object {
  objectEach(style, (value, property) => {
    if (property === 'extend') {
      const extensions = [].concat(value)

      arrayEach(extensions, extension =>
        extendStyle(style, extension, extend, type, renderer)
      )
      delete style[property]
    } else if (isPlainObject(value)) {
      // support nested extend as well
      style[property] = extend(value, type, renderer)
    }
  })

  return style
}

export default () => extend
