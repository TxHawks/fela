/* @flow */
import arrayReduce from 'fast-loops/lib/arrayReduce'
import objectReduce from 'fast-loops/lib/objectReduce'

import applyKeysInOrder from './applyKeysInOrder'
import generateCSSRule from './generateCSSRule'

import { RULE_TYPE, KEYFRAME_TYPE, FONT_TYPE, STATIC_TYPE } from './styleTypes'

const handlers = {
  [RULE_TYPE]: (cluster, { selector, declaration, support, media }) => {
    const cssRule = generateCSSRule(selector, declaration)

    if (support) {
      if (media) {
        if (!cluster.supportMediaRules[media]) {
          cluster.supportMediaRules[media] = {}
        }

        if (!cluster.supportMediaRules[media][support]) {
          cluster.supportMediaRules[media][support] = ''
        }

        cluster.supportMediaRules[media][support] += cssRule
      } else {
        if (!cluster.supportRules[support]) {
          cluster.supportRules[support] = ''
        }

        cluster.supportRules[support] += cssRule
      }
    } else {
      if (media) {
        if (!cluster.mediaRules[media]) {
          cluster.mediaRules[media] = ''
        }

        cluster.mediaRules[media] += cssRule
      } else {
        cluster.rules += cssRule
      }
    }
  },
  [FONT_TYPE]: (cluster, { fontFace }) => {
    cluster.fontFaces += fontFace
  },
  [KEYFRAME_TYPE]: (cluster, { keyframe }) => {
    cluster.keyframes += keyframe
  },
  [STATIC_TYPE]: (cluster, { css, selector }) => {
    if (selector) {
      cluster.statics += generateCSSRule(selector, css)
    } else {
      cluster.statics += css
    }
  },
}

export default function clusterCache(
  cache: Object,
  mediaQueryOrder: Array<string> = [],
  supportQueryOrder: Array<string> = []
) {
  const mediaRules = applyKeysInOrder(mediaQueryOrder)
  const supportRules = applyKeysInOrder(supportQueryOrder)

  const supportMediaRules = arrayReduce(
    mediaQueryOrder,
    (supportRules, media) => {
      supportRules[media] = applyKeysInOrder(supportQueryOrder)
      return supportRules
    },
    applyKeysInOrder(mediaQueryOrder, {})
  )

  return objectReduce(
    cache,
    (cluster, entry, key) => {
      const handler = handlers[entry.type]

      if (handler) {
        handler(cluster, entry)
      }

      return cluster
    },
    {
      mediaRules,
      supportRules,
      supportMediaRules,
      fontFaces: '',
      statics: '',
      keyframes: '',
      rules: '',
    }
  )
}
