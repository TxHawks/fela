/* @flow  */
import arrayReduce from 'fast-loops/lib/arrayReduce'

export default function extractPassThroughProps(
  passThrough: Array<string>,
  ruleProps: Object
): Object {
  return arrayReduce(
    passThrough,
    (output, property) => {
      if (ruleProps.hasOwnProperty(property)) {
        output[property] = ruleProps[property]
      }

      return output
    },
    {}
  )
}
