import type { CSSObject } from '@developerli/styled'
import type { FullToken, GenerateStyle } from '../../theme'
import { genComponentStyleHook, mergeToken } from '../../theme'

export interface ComponentToken {
  colorBgHeader: string
  colorBgBody: string
  colorBgTrigger: string
}

export interface LayoutToken extends FullToken<'Layout'> {
  // Layout
  layoutHeaderHeight: number
  layoutHeaderPaddingInline: number
  layoutHeaderColor: string
  layoutFooterPadding: string
  layoutTriggerHeight: number
  layoutZeroTriggerSize: number
}

const genLayoutStyle: GenerateStyle<LayoutToken, CSSObject> = token => {
  const {
    muiCls, // .mui
    componentCls, // .mui-layout
    colorText,
    colorTextLightSolid,
    colorBgHeader,
    colorBgBody,
    colorBgTrigger,
    layoutHeaderHeight,
    layoutHeaderPaddingInline,
    layoutHeaderColor,
    layoutFooterPadding,
    layoutTriggerHeight,
    layoutZeroTriggerSize,
    motionDurationMid,
    motionDurationSlow,
    fontSizeBase,
    radiusBase,
  } = token

  return {
    [componentCls]: {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'column',
      minHeight: 0,
      background: colorBgBody,

      '&, *': {
        boxSizing: 'border-box',
      },

      [`&${componentCls}-has-sider`]: {
        flexDirection: 'row',
        [`> ${componentCls}, > ${componentCls}-content`]: {
          width: 0,
        },
      },

      [`${componentCls}-header, &${componentCls}-footer`]: {
        flex: '0 0 auto',
      },

      [`${componentCls}-header`]: {
        height: layoutHeaderHeight,
        paddingInline: layoutHeaderPaddingInline,
        color: layoutHeaderColor,
        lineHeight: `${layoutHeaderHeight}px`,
        background: colorBgHeader,
        [`${muiCls}-menu`]: {
          lineHeight: 'inherit',
        },
      },

      [`${componentCls}-footer`]: {
        padding: layoutFooterPadding,
        color: colorText,
        fontSize: fontSizeBase,
        background: colorBgBody,
      },

      [`${componentCls}-content`]: {
        flex: 'auto',
        minHeight: 0,
      },

      [`${componentCls}-sider`]: {
        position: 'relative',
        minWidth: 0,
        background: colorBgHeader,
        transition: `all ${motionDurationMid}`,

        '&-children': {
          height: '100%',
          marginTop: -0.1,
          paddingTop: 0.1,

          [`${muiCls}-menu${muiCls}menu-inline-collapsed`]: {
            width: 'auto',
          },
        },

        '&-has-trigger': {
          paddingBottom: layoutTriggerHeight,
        },

        '&-right': {
          order: 1,
        },

        '&-trigger': {
          position: 'fixed',
          bottom: 0,
          zIndex: 1,
          height: layoutTriggerHeight,
          color: colorTextLightSolid,
          lineHeight: `${layoutTriggerHeight}px`,
          textAlign: 'center',
          background: colorBgTrigger,
          cursor: 'pointer',
          transition: `all ${motionDurationMid}`,
        },

        '&-zero-width': {
          '> *': {
            overflow: 'hidden',
          },

          '&-trigger': {
            position: 'absolute',
            top: layoutHeaderHeight,
            insetInlineEnd: -layoutZeroTriggerSize,
            zIndex: 1,
            width: layoutZeroTriggerSize,
            height: layoutZeroTriggerSize,
            color: colorTextLightSolid,
            fontSize: token.fontSizeXL,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colorBgHeader,
            borderStartStartRadius: 0,
            borderStartEndRadius: radiusBase,
            borderEndEndRadius: radiusBase,
            borderEndStartRadius: 0,

            cursor: 'pointer',
            transition: `background ${motionDurationSlow} ease`,

            '&::after': {
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              transition: `all ${motionDurationSlow}`,
              content: '""',
            },

            '&:hover::after': {
              background: `rgba(255, 255, 255, 0.2)`,
            },

            '&-right': {
              insetInlineStart: -layoutZeroTriggerSize,
              borderStartStartRadius: radiusBase,
              borderStartEndRadius: 0,
              borderEndEndRadius: 0,
              borderEndStartRadius: radiusBase,
            },
          },
        },
      },
    },
  }
}

// ============================== Export ==============================
export default genComponentStyleHook(
  'Layout',
  token => {
    const { colorText, controlHeightSM, controlHeight, controlHeightLG, marginXXS } = token
    const layoutHeaderPaddingInline = controlHeightLG * 1.25

    const layoutToken = mergeToken<LayoutToken>(token, {
      // Layout
      layoutHeaderHeight: controlHeight * 2,
      layoutHeaderPaddingInline,
      layoutHeaderColor: colorText,
      layoutFooterPadding: `${controlHeightSM}px ${layoutHeaderPaddingInline}px`,
      layoutTriggerHeight: controlHeightLG + marginXXS * 2, // = item height + margin
      layoutZeroTriggerSize: controlHeightLG,
    })

    return [genLayoutStyle(layoutToken)]
  },
  {
    colorBgHeader: '#001529',
    colorBgBody: '#f0f2f5',
    colorBgTrigger: '#002140',
  },
)
