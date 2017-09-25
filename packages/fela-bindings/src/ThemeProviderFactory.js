/* @flow */
import { shallowEqual } from 'recompose'
import { objectEach } from 'fela-utils'

import createTheme from './createTheme'

export default function ThemeProviderFactory(
  BaseComponent: any,
  renderChildren: Function,
  statics?: Object
): any {
  class ThemeProvider extends BaseComponent {
    theme: Object

    constructor(props: Object, context: Object) {
      super(props, context)

      const previousTheme = !props.overwrite && this.context.theme
      this.theme = createTheme(props.theme, previousTheme)
    }

    componentWillReceiveProps(nextProps: Object): void {
      this.theme.update(nextProps.theme)
    }

    shouldComponentUpdate(nextProps: Object): boolean {
      return shallowEqual(this.props.theme, nextProps.theme) === false
    }

    getChildContext(): Object {
      return {
        theme: this.theme
      }
    }

    render(): Object {
      return renderChildren(this.props.children)
    }
  }

  if (statics) {
    objectEach(statics, (value, key) => {
      ThemeProvider[key] = value
    })
  }

  return ThemeProvider
}
