/* @flow */
import { objectReduce, hoistStatics } from 'fela-utils'
import generateDisplayName from './generateDisplayName'

export default function connectFactory(
  BaseComponent: any,
  createElement: Function,
  withTheme: Function,
  contextTypes?: Object
): Function {
  return function connect(rules: Object): Function {
    return (component: any): any => {
      class EnhancedComponent extends BaseComponent {
        static displayName = generateDisplayName(component)

        render() {
          const { renderer } = this.context

          const styles = objectReduce(
            rules,
            (styleMap, rule, name) => {
              styleMap[name] = renderer.renderRule(rule, this.props)
              return styleMap
            },
            {}
          )

          const { theme, ...propsWithoutTheme } = this.props
          return createElement(component, {
            ...propsWithoutTheme,
            styles
          })
        }
      }

      if (contextTypes) {
        EnhancedComponent.contextTypes = contextTypes
      }

      const themedComponent = withTheme(EnhancedComponent)
      return hoistStatics(themedComponent, component)
    }
  }
}
