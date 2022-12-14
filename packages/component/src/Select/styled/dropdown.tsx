import type { CSSObject } from '@developerli/styled'
import type { SelectToken } from '.'
import {
  initMoveMotion,
  initSlideMotion,
  slideDownIn,
  slideDownOut,
  slideUpIn,
  slideUpOut,
} from '../../style/motion'
import type { GenerateStyle } from '../../theme'
import { resetComponent } from '../../style'

const genItemStyle: GenerateStyle<SelectToken, CSSObject> = token => {
  const { controlPaddingHorizontal } = token

  return {
    position: 'relative',
    display: 'block',
    minHeight: token.controlHeight,
    padding: `${
      (token.controlHeight - token.fontSize * token.lineHeight) / 2
    }px ${controlPaddingHorizontal}px`,
    color: token.colorText,
    fontWeight: 'normal',
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    boxSizing: 'border-box',
  }
}

const genSingleStyle: GenerateStyle<SelectToken> = token => {
  const { muiCls, componentCls } = token

  const selectItemCls = `${componentCls}-item`

  return [
    {
      [`${componentCls}-dropdown`]: {
        // ========================== Popup ==========================
        ...resetComponent(token),

        position: 'absolute',
        top: -9999,
        zIndex: token.zIndexPopup,
        boxSizing: 'border-box',
        padding: token.paddingXXS,
        overflow: 'hidden',
        fontSize: token.fontSize,
        fontVariant: 'initial',
        backgroundColor: token.colorBgElevated,
        borderRadius: token.controlRadiusLG,
        outline: 'none',
        boxShadow: token.boxShadowSecondary,

        [`
            &${muiCls}-slide-up-enter${muiCls}-slide-up-enter-active&-placement-bottomLeft,
            &${muiCls}-slide-up-appear${muiCls}-slide-up-appear-active&-placement-bottomLeft
          `]: {
          animationName: slideUpIn,
        },

        [`
            &${muiCls}-slide-up-enter${muiCls}-slide-up-enter-active&-placement-topLeft,
            &${muiCls}-slide-up-appear${muiCls}-slide-up-appear-active&-placement-topLeft
          `]: {
          animationName: slideDownIn,
        },

        [`&${muiCls}-slide-up-leave${muiCls}-slide-up-leave-active&-placement-bottomLeft`]: {
          animationName: slideUpOut,
        },

        [`&${muiCls}-slide-up-leave${muiCls}-slide-up-leave-active&-placement-topLeft`]: {
          animationName: slideDownOut,
        },

        '&-hidden': {
          display: 'none',
        },

        '&-empty': {
          color: token.colorTextDisabled,
        },

        // ========================= Options =========================
        [`${selectItemCls}-empty`]: {
          ...genItemStyle(token),
          color: token.colorTextDisabled,
        },

        [`${selectItemCls}`]: {
          ...genItemStyle(token),
          cursor: 'pointer',
          transition: `background ${token.motionDurationSlow} ease`,
          borderRadius: token.radiusSM,

          // =========== Group ============
          '&-group': {
            color: token.colorTextDescription,
            fontSize: token.fontSizeSM,
            cursor: 'default',
          },

          // =========== Option ===========
          '&-option': {
            display: 'flex',

            '&-content': {
              flex: 'auto',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },

            '&-state': {
              flex: 'none',
            },

            [`&-active:not(${selectItemCls}-option-disabled)`]: {
              backgroundColor: token.controlItemBgHover,
            },

            [`&-selected:not(${selectItemCls}-option-disabled)`]: {
              color: token.colorText,
              fontWeight: token.fontWeightStrong,
              backgroundColor: token.controlItemBgActive,

              [`${selectItemCls}-option-state`]: {
                color: token.colorPrimary,
              },
            },
            '&-disabled': {
              [`&${selectItemCls}-option-selected`]: {
                backgroundColor: token.colorBgContainerDisabled,
              },

              color: token.colorTextDisabled,
              cursor: 'not-allowed',
            },

            '&-grouped': {
              paddingInlineStart: token.controlPaddingHorizontal * 2,
            },
          },
        },
      },
    },

    // Follow code may reuse in other components
    initSlideMotion(token, 'slide-up'),
    initSlideMotion(token, 'slide-down'),
    initMoveMotion(token, 'move-up'),
    initMoveMotion(token, 'move-down'),
  ]
}

export default genSingleStyle
