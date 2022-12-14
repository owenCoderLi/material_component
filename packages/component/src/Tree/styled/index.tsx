import type { CSSInterpolation, CSSObject } from '@developerli/styled'
import { Keyframes } from '@developerli/styled'
import { genCollapseMotion } from '../../style/motion'
import { getStyle as getCheckboxStyle } from '../../Checkbox/styled'
import type { DerivativeToken } from '../../theme'
import { genComponentStyleHook, mergeToken } from '../../theme'
import { genFocusOutline, resetComponent } from '../../style'

// ============================ Keyframes =============================
const treeNodeFX = new Keyframes('ant-tree-node-fx-do-not-use', {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
})

// ============================== Switch ==============================
const getSwitchStyle = (prefixCls: string, token: DerivativeToken): CSSObject => ({
  [`.${prefixCls}-switcher-icon`]: {
    display: 'inline-block',
    // fontSize: 10,
    fontSize: `${token.fontSize + 6}px`, // 20
    verticalAlign: 'baseline',

    svg: {
      transition: `transform ${token.motionDurationSlow}`,
    },
  },
})

// =============================== Drop ===============================
const getDropIndicatorStyle = (prefixCls: string, token: DerivativeToken) => ({
  [`.${prefixCls}-drop-indicator`]: {
    position: 'absolute',
    // it should displayed over the following node
    zIndex: 1,
    height: 2,
    backgroundColor: token.colorPrimary,
    borderRadius: 1,
    pointerEvents: 'none',

    '&:after': {
      position: 'absolute',
      top: -4, // 3 - 4
      insetInlineStart: -10, // 6 - 10
      width: 8,
      height: 8,
      backgroundColor: 'transparent',
      border: `${token.lineWidthBold}px solid ${token.colorPrimary}`,
      borderRadius: '50%',
      content: '""',
    },
  },
})

// =============================== Base ===============================
type TreeToken = DerivativeToken & {
  treeCls: string
  treeNodeCls: string
  treeNodePadding: number
  treeTitleHeight: number
}

export const genBaseStyle = (prefixCls: string, token: TreeToken): CSSObject => {
  const { treeCls, treeNodeCls, treeNodePadding, treeTitleHeight } = token
  const treeCheckBoxMarginHorizontal = token.paddingXS

  return {
    [treeCls]: {
      ...resetComponent(token),
      background: token.colorBgContainer,
      borderRadius: token.controlRadius,
      transition: `background-color ${token.motionDurationSlow}`,

      '&-focused:not(:hover):not(&-active-focused)': {
        ...genFocusOutline(token),
      },

      // =================== Virtual List ===================
      [`${treeCls}-list-holder-inner`]: {
        // alignItems: 'flex-start',
        alignItems: 'stretch',
      },

      [`&${treeCls}-block-node`]: {
        [`${treeCls}-list-holder-inner`]: {
          alignItems: 'stretch',

          // >>> Title
          [`${treeCls}-node-content-wrapper`]: {
            flex: 'auto',
            display: 'block',
          },

          // >>> Drag
          [`${treeNodeCls}.dragging`]: {
            position: 'relative',

            '&:after': {
              position: 'absolute',
              top: 0,
              insetInlineEnd: 0,
              bottom: treeNodePadding,
              insetInlineStart: 0,
              border: `1px solid ${token.colorPrimary}`,
              opacity: 0,
              animationName: treeNodeFX,
              animationDuration: token.motionDurationSlow,
              animationPlayState: 'running',
              animationFillMode: 'forwards',
              content: '""',
              pointerEvents: 'none',
            },
          },
        },
      },

      // ===================== TreeNode =====================
      [`${treeNodeCls}`]: {
        display: 'flex',
        // alignItems: 'flex-start',
        alignItems: 'center',
        // padding: `0 0 ${treeNodePadding}px 0`, // 8 - 4 0
        padding: `${treeNodePadding}px 0 ${treeNodePadding}px 0`,
        margin: `${treeNodePadding * 2}px`,
        outline: 'none',

        // Disabled
        '&-disabled': {
          // >>> Title
          [`${treeCls}-node-content-wrapper`]: {
            color: token.colorTextDisabled,
            cursor: 'not-allowed',
            '&:hover': {
              background: 'transparent',
            },
          },
        },

        [`&-active ${treeCls}-node-content-wrapper`]: {
          ...genFocusOutline(token),
        },

        [`&:not(&-disabled).filter-node ${treeCls}-title`]: {
          color: 'inherit',
          fontWeight: 500,
        },

        '&-draggable': {
          [`${treeCls}-draggable-icon`]: {
            width: treeTitleHeight,
            // lineHeight: `${treeTitleHeight}px`,
            lineHeight: 0,
            textAlign: 'center',
            visibility: 'visible',
            opacity: 0.2,
            transition: `opacity ${token.motionDurationSlow}`,

            [`${treeNodeCls}:hover &`]: {
              opacity: 0.45,
            },
          },

          [`&${treeNodeCls}-disabled`]: {
            [`${treeCls}-draggable-icon`]: {
              visibility: 'hidden',
            },
          },
        },
      },

      // >>> Indent
      [`${treeCls}-indent`]: {
        alignSelf: 'stretch',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        '&-unit': {
          display: 'inline-block',
          width: treeTitleHeight,
        },
      },

      // >>> Drag Handler
      [`${treeCls}-draggable-icon`]: {
        visibility: 'hidden',
      },

      // >>> Switcher
      [`${treeCls}-switcher`]: {
        ...getSwitchStyle(prefixCls, token),
        position: 'relative',
        flex: 'none',
        alignSelf: 'stretch',
        width: treeTitleHeight,
        height: treeTitleHeight,
        margin: 0,
        // lineHeight: `${treeTitleHeight}px`,
        lineHeight: 0,
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none',

        '&-noop': {
          cursor: 'default',
        },

        '&_close': {
          'svg': {
            fontSize: `${token.fontSize + 6}px`, // 20
            transform: 'rotate(-90deg)',
            transition: 'transform .3s',
          },
        },
        '&_open': {
          'svg': {
            fontSize: `${token.fontSize + 6}px`, // 20
            transform: 'rotate(0deg)',
            transition: 'transform .3s',
          },
        },

        '&-loading-icon': {
          color: token.colorPrimary,
        },

        '&-leaf-line': {
          position: 'relative',
          zIndex: 1,
          display: 'inline-block',
          width: '100%',
          height: '100%',
          '&:before': {
            position: 'absolute',
            top: 0,
            insetInlineEnd: treeTitleHeight / 2,
            bottom: -treeNodePadding,
            marginInlineStart: -1,
            borderInlineEnd: `1px solid ${token.colorBorder}`,
            content: '""',
          },

          '&:after': {
            position: 'absolute',
            width: (treeTitleHeight / 2) * 0.8,
            height: treeTitleHeight / 2,
            borderBottom: `1px solid ${token.colorBorder}`,
            content: '""',
          },
        },
      },

      // >>> Checkbox
      [`${treeCls}-checkbox`]: {
        top: 'initial',
        marginInlineEnd: treeCheckBoxMarginHorizontal,
        // marginBlockStart: treeCheckBoxMarginVertical,
      },

      // >>> Title
      [`
        ${treeCls}-node-content-wrapper,
        ${treeCls}-checkbox + span
      `]: {
        display: 'flex',
        flexWrap: 'nowrap',
        position: 'relative',
        zIndex: 'auto',
        minHeight: treeTitleHeight,
        margin: 0,
        // padding: `0 ${token.paddingXS / 2}px`,
        padding: 0,
        color: 'inherit',
        lineHeight: `${treeTitleHeight}px`,
        background: 'transparent',
        borderRadius: token.controlRadius,
        cursor: 'pointer',
        transition: `all ${token.motionDurationFast}, border 0s, line-height 0s, box-shadow 0s`,

        '&:hover': {
          backgroundColor: token.controlItemBgHover,
        },

        [`&${treeCls}-node-selected`]: {
          backgroundColor: token.controlOutline,
        },

        // Icon
        [`${treeCls}-iconEle`]: {
          display: 'inline-block',
          width: treeTitleHeight,
          height: treeTitleHeight,
          lineHeight: `${treeTitleHeight}px`,
          textAlign: 'center',
          verticalAlign: 'top',
          marginRight: `${token.paddingXS / 2}px`,

          '&:empty': {
            display: 'none',
          },
        },
      },

      [`${treeCls}-unselectable ${treeCls}-node-content-wrapper:hover`]: {
        backgroundColor: 'transparent',
      },

      // ==================== Draggable =====================
      [`${treeCls}-node-content-wrapper`]: {
        lineHeight: `${treeTitleHeight}px`,
        userSelect: 'none',

        ...getDropIndicatorStyle(prefixCls, token),
      },

      [`${treeNodeCls}.drop-container`]: {
        '> [draggable]': {
          boxShadow: `0 0 0 2px ${token.colorPrimary}`,
        },
      },

      // ==================== Show Line =====================
      '&-show-line': {
        // ================ Indent lines ================
        [`${treeCls}-indent`]: {
          '&-unit': {
            position: 'relative',
            height: '100%',

            '&:before': {
              position: 'absolute',
              top: 0,
              right: treeTitleHeight / 2,
              bottom: `${-treeNodePadding * 2}px`,
              borderInlineEnd: `1px solid ${token.colorBorder}`,
              content: '""',
            },

            '&-end': {
              '&:before': {
                display: 'none',
              },
            },
          },
        },

        // ============== Cover Background ==============
        [`${treeCls}-switcher`]: {
          background: token.colorBgContainer,

          '&-line-icon': {
            verticalAlign: '-0.15em',
          },
        },
      },

      [`${treeNodeCls}-leaf-last`]: {
        [`${treeCls}-switcher`]: {
          '&-leaf-line': {
            '&:before': {
              top: 'auto !important',
              bottom: 'auto !important',
              height: `${treeTitleHeight / 2}px !important`,
            },
          },
        },
      },
    },
  }
}

// ============================ Directory =============================
export const genDirectoryStyle = (token: TreeToken): CSSObject => {
  const { treeCls, treeNodeCls, treeNodePadding } = token

  return {
    [`${treeCls}${treeCls}-directory`]: {
      // ================== TreeNode ==================
      [treeNodeCls]: {
        position: 'relative',

        // Hover color
        '&:before': {
          position: 'absolute',
          top: 0,
          insetInlineEnd: 0,
          bottom: treeNodePadding,
          insetInlineStart: 0,
          transition: `background-color ${token.motionDurationFast}`,
          content: '""',
          pointerEvents: 'none',
        },

        '&:hover': {
          '&:before': {
            background: token.controlItemBgHover,
          },
        },

        // Elements
        '> *': {
          zIndex: 1,
        },

        // >>> Switcher
        [`${treeCls}-switcher`]: {
          transition: `color ${token.motionDurationFast}`,
        },

        // >>> Title
        [`${treeCls}-node-content-wrapper`]: {
          borderRadius: 0,
          userSelect: 'none',

          '&:hover': {
            background: 'transparent',
          },

          [`&.${treeCls}-node-selected`]: {
            color: token.colorTextLightSolid,
            background: 'transparent',
          },
        },

        // ============= Selected =============
        '&-selected': {
          [`
            &:hover::before,
            &::before
          `]: {
            background: token.colorPrimary,
          },

          // >>> Switcher
          [`${treeCls}-switcher`]: {
            color: token.colorTextLightSolid,
          },

          // >>> Title
          [`${treeCls}-node-content-wrapper`]: {
            color: token.colorTextLightSolid,
            background: 'transparent',
          },
        },
      },
    },
  }
}

// ============================== Merged ==============================
export const genTreeStyle = (prefixCls: string, token: DerivativeToken): CSSInterpolation => {
  const treeCls = `.${prefixCls}`
  const treeNodeCls = `${treeCls}-treenode`

  const treeNodePadding = token.paddingXS / 2
  // const treeTitleHeight = token.controlHeightSM
  const treeTitleHeight = token.controlHeightSM - 4 // 20

  const treeToken = mergeToken<TreeToken>(token, {
    treeCls,
    treeNodeCls,
    treeNodePadding,
    treeTitleHeight,
  })

  return [
    // Basic
    genBaseStyle(prefixCls, treeToken),
    // Directory
    genDirectoryStyle(treeToken),
  ]
}

// ============================== Export ==============================
export default genComponentStyleHook('Tree', (token, { prefixCls }) => [
  {
    [token.componentCls]: getCheckboxStyle(`${prefixCls}-checkbox`, token),
  },
  genTreeStyle(prefixCls, token),
  genCollapseMotion(token),
])
