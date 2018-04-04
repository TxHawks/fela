/* @flow */
import shallowEqual from 'shallow-equal/objects'
import objectEach from 'fast-loops/lib/objectEach'

import createTheme from './createTheme'
import { THEME_CHANNEL } from './themeChannel'

export default function ThemeProviderFactory(
  BaseComponent: any,
  renderChildren: Function,
  statics?: Object
): any {
  class ThemeProvider extends BaseComponent {
    theme: Object

    constructor(props: Object, context: Object) {
      super(props, context)

      const previousTheme = !props.overwrite && this.context[THEME_CHANNEL]
      this.theme = createTheme(props.theme, previousTheme)
    }

    componentWillReceiveProps(nextProps: Object): void {
      if (!shallowEqual(this.props.theme, nextProps.theme)) {
        this.theme.update(nextProps.theme)
      }
    }

    getChildContext(): Object {
      return {
        [THEME_CHANNEL]: this.theme,
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
