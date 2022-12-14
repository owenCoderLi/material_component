import type { CSSObject } from '@developerli/styled'
import { TinyColor } from '@ctrl/tinycolor'
import type { InputToken } from '../../Input/styled'
import {
  genActiveStyle,
  genBasicInputStyle,
  genHoverStyle,
  initInputToken,
} from '../../Input/styled'
import { slideDownIn, slideDownOut, slideUpIn, slideUpOut } from '../../style/motion'
import type { FullToken, GenerateStyle } from '../../theme'
import { genComponentStyleHook, mergeToken } from '../../theme'
import type { GlobalToken } from '../../theme/interface'
import type { TokenWithCommonCls } from '../../theme/utils/genComponentStyleHook'
import { resetComponent, roundedArrow } from '../../style'

export interface ComponentToken {
  zIndexPopup: number
  circleBorderRadius: string
}

export type PickerPanelToken = {
  pickerCellInnerCls: string
  pickerTextHeight: number
  pickerPanelCellWidth: number
  pickerPanelCellHeight: number
  pickerDateHoverRangeBorderColor: string
  pickerBasicCellHoverWithRangeColor: string
  pickerPanelWithoutTimeCellHeight: number
  pickerYearMonthCellWidth: number
  pickerTimePanelColumnHeight: number
  pickerTimePanelColumnWidth: number
  pickerTimePanelCellHeight: number
  pickerCellPaddingVertical: number
  pickerQuarterPanelContentHeight: number
  pickerCellBorderGap: number
  pickerControlIconSize: number
  pickerControlIconBorderWidth: number
}

type PickerToken = InputToken<FullToken<'DatePicker'>> & PickerPanelToken

type SharedPickerToken = Omit<PickerToken, 'zIndexPopup'>

const genPikerPadding = (
  token: PickerToken,
  inputHeight: number,
  fontSize: number,
  paddingHorizontal: number,
): CSSObject => {
  const fontHeight = Math.floor(fontSize * token.lineHeight) + 2
  const paddingTop = Math.max((inputHeight - fontHeight) / 2, 0)
  const paddingBottom = Math.max(inputHeight - fontHeight - paddingTop, 0)

  return {
    padding: `${paddingTop}px ${paddingHorizontal}px ${paddingBottom}px`,
  }
}

const genPickerCellInnerStyle = (token: SharedPickerToken): CSSObject => {
  const { componentCls, pickerCellInnerCls } = token

  return {
    '&::before': {
      position: 'absolute',
      top: '50%',
      insetInlineStart: 0,
      insetInlineEnd: 0,
      zIndex: 1,
      height: token.pickerPanelCellHeight,
      transform: 'translateY(-50%)',
      transition: `all ${token.motionDurationSlow}`,
      content: '""',
    },

    // >>> Default
    [pickerCellInnerCls]: {
      position: 'relative',
      zIndex: 2,
      display: 'inline-block',
      // minWidth: token.pickerPanelCellHeight, 24 -> 36
      minWidth: token.pickerPanelCellHeight * 1.5,
      height: token.pickerPanelCellHeight * 1.5,
      lineHeight: `${token.pickerPanelCellHeight * 1.5}px`,
      borderRadius: token.circleBorderRadius,
      transition: `background ${token.motionDurationFast}, border ${token.motionDurationFast}`,
    },

    // >>> Hover
    [`&:hover:not(&-in-view),
    &:hover:not(&-selected):not(&-range-start):not(&-range-end):not(&-range-hover-start):not(&-range-hover-end)`]:
      {
        [pickerCellInnerCls]: {
          background: token.controlItemBgHover,
        },
      },

    // >>> Today
    [`&-in-view:is(&-today) ${pickerCellInnerCls}`]: {
      '&::before': {
        position: 'absolute',
        top: 0,
        insetInlineEnd: 0,
        bottom: 0,
        insetInlineStart: 0,
        zIndex: 1,
        border: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorPrimary}`,
        borderRadius: token.circleBorderRadius,
        content: '""',
      },
    },

    // >>> In Range
    '&-in-view:is(&-in-range)': {
      position: 'relative',

      '&::before': {
        background: token.controlItemBgActive,
      },
    },

    // >>> Selected
    [`&-in-view:is(&-selected) ${pickerCellInnerCls},
    &-in-view:is(&-range-start) ${pickerCellInnerCls},
    &-in-view:is(&-range-end) ${pickerCellInnerCls}`]: {
      color: token.colorTextLightSolid,
      background: token.colorPrimary,
    },

    [`&-in-view:is(&-range-start):not(&-range-start-single),
      &-in-view:is(&-range-end):not(&-range-end-single)`]: {
      '&::before': {
        background: token.controlItemBgActive,
      },
    },

    '&-in-view:is(&-range-start)::before': {
      insetInlineStart: '50%',
    },

    '&-in-view:is(&-range-end)::before': {
      insetInlineEnd: '50%',
    },

    // >>> Range Hover
    [`&-in-view:is(&-range-hover-start):not(&-in-range):not(&-range-start):not(&-range-end),
      &-in-view:is(&-range-hover-end):not(&-in-range):not(&-range-start):not(&-range-end),
      &-in-view:is(&-range-hover-start):is(&-range-start-single),
      &-in-view:is(&-range-hover-start):is(&-range-start):is(&-range-end):is(&-range-end-near-hover),
      &-in-view:is(&-range-hover-end):is(&-range-start):is(&-range-end):is(&-range-start-near-hover),
      &-in-view:is(&-range-hover-end):is(&-range-end-single),
      &-in-view:is(&-range-hover):not(&-in-range)`]: {
      '&::after': {
        position: 'absolute',
        top: '50%',
        zIndex: 0,
        height: token.controlHeightSM,
        borderTop: `${token.controlLineWidth}px dashed ${token.pickerDateHoverRangeBorderColor}`,
        borderBottom: `${token.controlLineWidth}px dashed ${token.pickerDateHoverRangeBorderColor}`,
        transform: 'translateY(-50%)',
        transition: `all ${token.motionDurationSlow}`,
        content: '""',
      },
    },

    // Add space for stash
    [`&-range-hover-start::after,
      &-range-hover-end::after,
      &-range-hover::after`]: {
      insetInlineEnd: 0,
      insetInlineStart: token.pickerCellBorderGap,
    },

    // Hover with in range
    [`&-in-view:is(&-in-range):is(&-range-hover)::before,
      &-in-view:is(&-range-start):is(&-range-hover)::before,
      &-in-view:is(&-range-end):is(&-range-hover)::before,
      &-in-view:is(&-range-start):not(&-range-start-single):is(&-range-hover-start)::before,
      &-in-view:is(&-range-end):not(&-range-end-single):is(&-range-hover-end)::before,
      ${componentCls}-panel
      > :not(${componentCls}-date-panel)
      &-in-view:is(&-in-range):is(&-range-hover-start)::before,
      ${componentCls}-panel
      > :not(${componentCls}-date-panel)
      &-in-view:is(&-in-range):is(&-range-hover-end)::before`]: {
      background: token.pickerBasicCellHoverWithRangeColor,
    },

    // range start border-radius
    [`&-in-view:is(&-range-start):not(&-range-start-single):not(&-range-end) ${pickerCellInnerCls}`]:
      {
        borderStartStartRadius: token.controlRadiusSM,
        borderEndStartRadius: token.controlRadiusSM,
        borderStartEndRadius: 0,
        borderEndEndRadius: 0,
      },

    // range end border-radius
    [`&-in-view:is(&-range-end):not(&-range-end-single):not(&-range-start) ${pickerCellInnerCls}`]:
      {
        borderStartStartRadius: 0,
        borderEndStartRadius: 0,
        borderStartEndRadius: token.controlRadiusSM,
        borderEndEndRadius: token.controlRadiusSM,
      },

    '&-range-hover:is(&-range-end)::after': {
      insetInlineStart: '50%',
    },

    // Edge start
    [`tr > &-in-view:is(&-range-hover):first-child::after,
      tr > &-in-view:is(&-range-hover-end):first-child::after,
      &-in-view:is(&-start):is(&-range-hover-edge-start):is(&-range-hover-edge-start-near-range)::after,
      &-in-view:is(&-range-hover-edge-start):not(&-range-hover-edge-start-near-range)::after,
      &-in-view:is(&-range-hover-start)::after`]: {
      insetInlineStart: (token.pickerPanelCellWidth - token.pickerPanelCellHeight) / 2,
      borderInlineStart: `${token.controlLineWidth}px dashed ${token.pickerDateHoverRangeBorderColor}`,
      borderTopLeftRadius: token.circleBorderRadius,
      borderBottomLeftRadius: token.circleBorderRadius,
    },

    // Edge end
    [`tr > &-in-view:is(&-range-hover):last-child::after,
      tr > &-in-view:is(&-range-hover-start):last-child::after,
      &-in-view:is(&-end):is(&-range-hover-edge-end):is(&-range-hover-edge-end-near-range)::after,
      &-in-view:is(&-range-hover-edge-end):not(&-range-hover-edge-end-near-range)::after,
      &-in-view:is(&-range-hover-end)::after`]: {
      insetInlineEnd: (token.pickerPanelCellWidth - token.pickerPanelCellHeight) / 2,
      borderInlineEnd: `${token.controlLineWidth}px dashed ${token.pickerDateHoverRangeBorderColor}`,
      borderTopRightRadius: token.circleBorderRadius,
      borderBottomRightRadius: token.circleBorderRadius,
    },

    // >>> Disabled
    '&-disabled': {
      color: token.colorTextDisabled,
      pointerEvents: 'none',

      [pickerCellInnerCls]: {
        background: 'transparent',
      },

      '&::before': {
        background: token.colorBgContainerDisabled,
      },
    },
    [`&-disabled:is(&-today) ${pickerCellInnerCls}::before`]: {
      borderColor: token.colorTextDisabled,
    },
  }
}

export const genPanelStyle = (token: SharedPickerToken): CSSObject => {
  const {
    componentCls, pickerCellInnerCls,
    pickerYearMonthCellWidth, pickerControlIconSize
  } = token

  const pickerPanelWidth = token.pickerPanelCellWidth * 7 + token.paddingSM * 2 + 4
  const hoverCellFixedDistance =
    (pickerPanelWidth - token.paddingXS * 2) / 3 - pickerYearMonthCellWidth / 2

  return {
    [componentCls]: {
      '&-panel': {
        display: 'inline-flex',
        flexDirection: 'column',
        textAlign: 'center',
        background: token.colorBgContainer,
        border: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorBorder}`,
        borderRadius: token.controlRadiusLG,
        outline: 'none',
        '&-focused': {
          borderColor: token.colorPrimary,
        },
      },

      // Shared Panel
      [`&-decade-panel,
        &-year-panel,
        &-month-panel,
        &-week-panel,
        &-date-panel,
        &-time-panel`]: {
        display: 'flex',
        flexDirection: 'column',
        width: pickerPanelWidth,
      },

      // ======================= Header =======================
      '&-header': {
        display: 'flex',
        // padding: `0 ${token.paddingXS}px`,
        padding: `${token.paddingXS}px`,
        color: token.colorTextHeading,
        borderBottom: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorSplit}`,

        '> *': {
          flex: 'none',
        },

        button: {
          padding: 0,
          color: token.colorIcon,
          // lineHeight: `${token.pickerTextHeight}px`,
          lineHeight: 0,
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
          transition: `color ${token.motionDurationFast}`,
        },

        '> button': {
          minWidth: '1.6em',
          fontSize: token.fontSize,

          '&:hover': {
            color: token.colorIconHover,
          },
        },

        '&-view': {
          flex: 'auto',
          fontWeight: token.fontWeightStrong,
          // lineHeight: `${token.pickerTextHeight}px`, 40 -> 25
          lineHeight: `${token.pickerTextHeight - 15}px`,
          button: {
            color: 'inherit',
            fontWeight: 'inherit',
            '&:not(:first-child)': {
              marginInlineStart: token.paddingXS,
            },
            '&:hover': {
              color: token.colorPrimary,
            },
          },
        },
      },
      // Arrow button
      [`&-prev-icon,
        &-next-icon,
        &-super-prev-icon,
        &-super-next-icon`]: {
        position: 'relative',
        display: 'inline-block',
        width: pickerControlIconSize,
        height: pickerControlIconSize,

        '&::before': {
          position: 'absolute',
          top: 0,
          insetInlineStart: 0,
          display: 'inline-block',
          width: pickerControlIconSize,
          height: pickerControlIconSize,
          border: `0 solid currentcolor`,
          borderBlockStartWidth: token.pickerControlIconBorderWidth,
          borderBlockEndWidth: 0,
          borderInlineStartWidth: token.pickerControlIconBorderWidth,
          borderInlineEndWidth: 0,
          content: '""',
        },
      },

      [`&-super-prev-icon,
        &-super-next-icon`]: {
        '&::after': {
          position: 'absolute',
          top: Math.ceil(pickerControlIconSize / 2),
          insetInlineStart: Math.ceil(pickerControlIconSize / 2),
          display: 'inline-block',
          width: pickerControlIconSize,
          height: pickerControlIconSize,
          border: '0 solid currentcolor',
          borderBlockStartWidth: token.pickerControlIconBorderWidth,
          borderBlockEndWidth: 0,
          borderInlineStartWidth: token.pickerControlIconBorderWidth,
          borderInlineEndWidth: 0,
          content: '""',
        },
      },

      [`&-prev-icon,
        &-super-prev-icon`]: {
        transform: 'rotate(-45deg)',
      },

      [`&-next-icon,
        &-super-next-icon`]: {
        transform: 'rotate(135deg)',
      },

      // ======================== Body ========================
      '&-content': {
        width: '100%',
        tableLayout: 'fixed',
        borderCollapse: 'collapse',

        'th, td': {
          position: 'relative',
          minWidth: token.pickerPanelCellHeight,
          fontWeight: 'normal',
        },

        th: {
          height: token.pickerPanelCellHeight + token.pickerCellPaddingVertical * 2,
          color: token.colorText,
          verticalAlign: 'middle',
        },
      },

      '&-cell': {
        padding: `${token.pickerCellPaddingVertical}px 0`,
        color: token.colorTextDisabled,
        cursor: 'pointer',

        // In view
        '&-in-view': {
          color: token.colorText,
        },

        ...genPickerCellInnerStyle(token),
      },

      // DatePanel only
      [`&-date-panel ${componentCls}-cell-in-view${componentCls}-cell-in-range${componentCls}-cell-range-hover-start ${pickerCellInnerCls},
        &-date-panel ${componentCls}-cell-in-view${componentCls}-cell-in-range${componentCls}-cell-range-hover-end ${pickerCellInnerCls}`]:
        {
          '&::after': {
            position: 'absolute',
            top: 0,
            bottom: 0,
            zIndex: -1,
            background: token.pickerBasicCellHoverWithRangeColor,
            transition: `all ${token.motionDurationSlow}`,
            content: '""',
          },
        },

      [`&-date-panel
        ${componentCls}-cell-in-view${componentCls}-cell-in-range${componentCls}-cell-range-hover-start
        ${pickerCellInnerCls}::after`]: {
        // insetInlineEnd: (token.pickerPanelCellWidth - token.pickerPanelCellHeight) / 2,
        insetInlineStart: 0,
      },

      [`&-date-panel ${componentCls}-cell-in-view${componentCls}-cell-in-range${componentCls}-cell-range-hover-end ${pickerCellInnerCls}::after`]:
        {
          insetInlineEnd: 0,
          // insetInlineStart: (token.pickerPanelCellWidth - token.pickerPanelCellHeight) / 2,
        },

      // Hover with range start & end
      '&-range-hover:is(&-range-start)::after': {
        insetInlineEnd: '50%',
      },

      [`&-decade-panel,
        &-year-panel,
        &-quarter-panel,
        &-month-panel`]: {
        [`${componentCls}-content`]: {
          height: token.pickerPanelWithoutTimeCellHeight * 4,
        },

        [pickerCellInnerCls]: {
          padding: `0 ${token.paddingXS}px`,
          borderRadius: token.radiusBase * 8, // 6 -> 16
        },
      },

      // ======================== Footer ========================
      [`&-panel ${componentCls}-footer`]: {
        borderTop: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorSplit}`,
      },

      '&-footer': {
        width: 'min-content',
        minWidth: '100%',
        lineHeight: `${token.pickerTextHeight - 2 * token.controlLineWidth + 2}px`, // 38 -> 40
        textAlign: 'center',
        // borderBottom: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorSplit}`,
        borderBottom: `${token.controlLineWidth + 1}px ${token.controlLineType} transparent`,

        '&-extra': {
          padding: `0 ${token.paddingSM}`,
          lineHeight: `${token.pickerTextHeight - 2 * token.controlLineWidth}px`,
          textAlign: 'start',

          '&:not(:last-child)': {
            borderBottom: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorBorder}`,
          },
        },
      },

      '&-now': {
        textAlign: 'start',
      },

      '&-today-btn': {
        color: token.colorLink,

        '&:hover': {
          color: token.colorLinkHover,
        },

        '&:active': {
          color: token.colorLinkActive,
        },

        '&:is(&-disabled)': {
          color: token.colorTextDisabled,
          cursor: 'not-allowed',
        },
      },

      // Decade Panel
      '&-decade-panel': {
        [pickerCellInnerCls]: {
          padding: `0 ${token.paddingXS / 2}px`,
        },

        [`${componentCls}-cell::before`]: {
          display: 'none',
        },
      },

      // Year & Month Panel
      [`&-year-panel,
        &-month-panel`]: {
        [`${componentCls}-body`]: {
          padding: `0 ${token.paddingXS}px`,
        },

        [pickerCellInnerCls]: {
          width: pickerYearMonthCellWidth,
        },

        [`${componentCls}-cell-range-hover-start::after`]: {
          insetInlineStart: hoverCellFixedDistance,
          borderInlineStart: `${token.controlLineWidth}px dashed ${token.pickerDateHoverRangeBorderColor}`,
          // borderStartStartRadius: token.controlRadiusSM,
          // borderBottomStartRadius: token.controlRadiusSM,
          borderStartStartRadius: token.circleBorderRadius,
          borderBottomStartRadius: token.circleBorderRadius,
          borderStartEndRadius: 0,
          borderBottomEndRadius: 0,
        },
        [`${componentCls}-cell-range-hover-end::after`]: {
          insetInlineEnd: hoverCellFixedDistance,
          borderInlineEnd: `${token.controlLineWidth}px dashed ${token.pickerDateHoverRangeBorderColor}`,
          borderStartStartRadius: 0,
          borderBottomStartRadius: 0,
          // borderStartEndRadius: token.controlRadius,
          // borderBottomEndRadius: token.controlRadius,
          borderStartEndRadius: token.circleBorderRadius,
          borderBottomEndRadius: token.circleBorderRadius,
        },
      },

      // ====================== Week Panel ======================
      '&-week-panel': {
        [`${componentCls}-body`]: {
          // padding: `${token.paddingXS}px ${token.paddingSM}px`, // 8 12 -> 10 20
          padding: `${token.paddingXS + 2}px ${token.paddingLG - 4}px`, // 8 12 -> 10 20
        },

        // Clear cell style
        [`${componentCls}-cell`]: {
          [`&:hover ${pickerCellInnerCls},
            &-selected ${pickerCellInnerCls},
            ${pickerCellInnerCls}`]: {
            background: 'transparent !important',
          },
        },

        '&-row': {
          td: {
            transition: `background ${token.motionDurationFast}`,

            '&:first-child': {
              borderStartStartRadius: token.radiusSM,
              borderEndStartRadius: token.radiusSM,
            },

            '&:last-child': {
              borderStartEndRadius: token.radiusSM,
              borderEndEndRadius: token.radiusSM,
            },
          },

          '&:hover td': {
            background: token.controlItemBgHover,
          },

          [`&-selected td,
            &-selected:hover td`]: {
            background: token.colorPrimary,

            [`&${componentCls}-cell-week`]: {
              color: new TinyColor(token.colorTextLightSolid).setAlpha(0.5).toHexString(),
            },

            [`&${componentCls}-cell-today ${pickerCellInnerCls}::before`]: {
              borderColor: token.colorTextLightSolid,
            },

            [pickerCellInnerCls]: {
              color: token.colorTextLightSolid,
            },
          },
        },
      },

      // ====================== Date Panel ======================
      '&-date-panel': {
        [`${componentCls}-body`]: {
          // padding: `${token.paddingXS}px ${token.paddingSM}px`,
          padding: `${token.paddingXS + 2}px ${token.paddingLG - 4}px`, // 8 12 -> 10 20
        },

        [`${componentCls}-content`]: {
          width: token.pickerPanelCellWidth * 7,

          th: {
            width: token.pickerPanelCellWidth,
          },
        },
      },

      // ==================== Datetime Panel ====================
      '&-datetime-panel': {
        display: 'flex',

        [`${componentCls}-time-panel`]: {
          borderInlineStart: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorBorder}`,
        },

        [`${componentCls}-date-panel,
          ${componentCls}-time-panel`]: {
          transition: `opacity ${token.motionDurationSlow}`,
        },

        // Keyboard
        '&-active': {
          [`${componentCls}-date-panel,
            ${componentCls}-time-panel`]: {
            opacity: 0.3,

            '&-active': {
              opacity: 1,
            },
          },
        },
      },

      // ====================== Time Panel ======================
      '&-time-panel': {
        width: 'auto',
        minWidth: 'auto',
        marginLeft: token.marginSM + 4,

        [`${componentCls}-content`]: {
          display: 'flex',
          flex: 'auto',
          height: token.pickerTimePanelColumnHeight,
        },

        '&-column': {
          flex: '1 0 auto',
          width: token.pickerTimePanelColumnWidth,
          margin: 0,
          padding: 0,
          overflowY: 'hidden',
          textAlign: 'start',
          listStyle: 'none',
          transition: `background ${token.motionDurationFast}`,
          overflowX: 'hidden',

          '&::after': {
            display: 'block',
            height: token.pickerTimePanelColumnHeight - token.pickerTimePanelCellHeight,
            content: '""',
            [`${componentCls}-datetime-panel &`]: {
              height:
                token.pickerTimePanelColumnHeight -
                token.pickerPanelWithoutTimeCellHeight +
                2 * token.controlLineWidth,
            },
          },

          '&:not(:first-child)': {
            borderInlineStart: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorSplit}`,
          },

          '&-active': {
            background: new TinyColor(token.controlItemBgActive).setAlpha(0.2).toHexString(),
          },

          '&:hover': {
            overflowY: 'auto',
          },

          '> li': {
            margin: 0,
            padding: 0,

            [`&${componentCls}-time-panel-cell`]: {
              // marginInline: token.marginXXS,
              [`${componentCls}-time-panel-cell-inner`]: {
                display: 'block',
                // width: token.pickerTimePanelColumnWidth - 2 * token.marginXXS,
                // height: token.pickerTimePanelCellHeight, // 28 -> 36
                height: token.pickerTimePanelCellHeight,
                margin: 0,
                paddingBlock: 0,
                paddingInlineEnd: 0,
                paddingInlineStart:
                  (token.pickerTimePanelColumnWidth - token.pickerTimePanelCellHeight) / 2 + 4,
                paddingTop: token.marginXXS / 2,
                paddingBottom: token.marginXXS / 2,
                color: token.colorText,
                lineHeight: `${token.pickerTimePanelCellHeight}px`,
                borderRadius: token.controlRadiusSM,
                cursor: 'pointer',
                transition: `background ${token.motionDurationFast}`,

                '&:hover': {
                  background: token.controlItemBgHover,
                },
              },

              '&-selected': {
                [`${componentCls}-time-panel-cell-inner`]: {
                  background: token.controlItemBgActive,
                },
              },

              '&-disabled': {
                [`${componentCls}-time-panel-cell-inner`]: {
                  color: token.colorTextDisabled,
                  background: 'transparent',
                  cursor: 'not-allowed',
                },
              },
            },
          },
        },
      },
    },
  }
}

const genPickerStatusStyle = (
  rootSelectCls: string,
  token: {
    componentCls: string
    outlineColor: string
    controlLineWidth: number
    borderWidth: number
  }
): CSSObject => {
  const { componentCls, outlineColor, borderWidth } = token
  return {
    [rootSelectCls]: {
      [`${componentCls}-outlined`]: {
        borderWidth: borderWidth,
        borderColor: outlineColor,
      },
      [`${componentCls}-label`]: {
        color: outlineColor,
      },
    }
  }
}

// control outlined fieldset active style
export const genOutlinedActiveStyle = (token: InputToken): CSSObject => {
  return {
    [`.${token.prefixCls}-outlined`]: {
      borderColor: token.colorPrimaryText,
      borderWidth: 2,
      color: token.colorPrimaryText,
    }
  }
}

const genActiveLabelStyle = (token: InputToken): CSSObject => {
  const { prefixCls } = token
  return {
    [`.${prefixCls}-label`]: {
      padding: '0 5px',
      transform: 'translate(14px, -4px) scale(0.75)',
      pointerEvents: 'auto',
      userSelect: 'none',
      color: token.colorPrimaryText,
    },
    [`.${prefixCls}-affix-wrapper`]: {
      '&::-webkit-input-placeholder': {
        color: 'inherit',
      },
      '&::-moz-input-placeholder': {
        color: 'inherit',
      },
      'input:placeholder': {
        color: 'inherit',
      },
    }
  }
}

// outlined
export const genOutlinedStyle = (token: PickerToken): CSSObject => {
  const { componentCls } = token
  return {
    [componentCls]: {
      [`${componentCls}-outlined`]: {
        textAlign: 'left',
        position: 'absolute',
        bottom: 0,
        right: 0,
        top: '-5px',
        left: 0,
        margin: 0,
        padding: '0 8px',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        borderStyle: 'solid',
        borderWidth: 1,
        overflow: 'hidden',
        minWidth: '0%',
        borderColor: 'rgba(0, 0, 0, 0.23)',
        'legend': {
          float: 'unset',
          overflow: 'hidden',
          display: 'block',
          width: 'auto',
          padding: 0,
          height: '11px',
          fontSize: '0.75em',
          visibility: 'hidden',
          maxWidth: '0.01px',
          transition: `max-width 50ms cubic-bezier(0.0. 0, 0.2, 1) 0ms;`,
          whiteSpace: 'nowrap',
          'span': {
            paddingLeft: 5,
            paddingRight: 5,
            display: 'inline-block',
            opacity: 0,
            visibility: 'visible',
          },
        },
      }
    }
  }
}

const genShrinkStyle = (token: PickerToken): CSSObject => {
  const { componentCls } = token
  return {
    [`${componentCls}-outlined > legend`]: {
      maxWidth: '100%',
    },
    ...genActiveLabelStyle(token),
  }
}

const genLabelStyle = (token: PickerToken): CSSObject => {
  return {
    color: 'rgba(0, 0, 0, 0.6)',
    fontFamily: token.fontFamily,
    fontWeight: 400,
    fontSize: token.fontSize,
    letterSpacing: '0.00938em',
    padding: 0,
    display: 'block',
    transformOrigin: 'top left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 'calc(100% - 24px)',
    position: 'absolute',
    left: -4,
    top: -4,
    transform: 'translate(14px 12px) scale(1)',
    transition: 'color 200ms cubic-bezier(0.0. 0, 0.2, 1)ms transform 200ms cubic-bezier(0.0. 0, 0.2, 1)0ms, max-width 200ms cubic-bezier(0.0. 0, 0.2, 1) 0ms',
    zIndex: 1,
    pointerEvents: 'none',
  }
}

const genPickerStyle: GenerateStyle<PickerToken> = token => {
  const { componentCls, muiCls, boxShadowPopoverArrow } = token

  return {
    [componentCls]: {
      ...resetComponent(token),
      ...genPikerPadding(token, token.controlHeight, token.fontSize, token.inputPaddingHorizontal),
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${token.paddingXS}px ${token.paddingSM - 1}px`,
      background: token.colorBgContainer,
      border: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorBorder}`,
      borderRadius: token.controlRadius,
      transition: `border ${token.motionDurationSlow}, box-shadow ${token.motionDurationSlow}`,

      '&:hover, &-focused': {
        ...genHoverStyle(token),
        borderColor: 'transparent',
      },

      '&-focused': {
        ...genActiveStyle(token),
        borderColor: 'transparent',
      },

      '&&-disabled': {
        background: token.colorBgContainerDisabled,
        borderColor: token.colorBorder,
        cursor: 'not-allowed',
        [`${componentCls}-label`]: {
          color: token.colorTextDisabled,
        },
        [`${componentCls}-suffix`]: {
          color: token.colorTextDisabled,
        },
      },

      // ======================== Input =========================
      [`${componentCls}-input`]: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',

        '> input': {
          ...genBasicInputStyle(token),
          flex: 'auto',
          minWidth: 1,
          height: 'auto',
          padding: 0,
          background: 'transparent',
          border: 0,

          '&:focus': {
            boxShadow: 'none',
          },

          '&[disabled]': {
            background: 'transparent',
          },
        },

        '&:hover': {
          [`${componentCls}-clear`]: {
            opacity: 1,
          },
        },

        '&-placeholder': {
          '> input': {
            color: token.colorTextPlaceholder,
          },
        },
      },

      // Size
      '&-large': {
        ...genPikerPadding(
          token,
          token.controlHeightLG,
          token.fontSizeLG,
          token.inputPaddingHorizontal,
        ),

        [`${componentCls}-input > input`]: {
          fontSize: token.fontSizeLG,
        },
      },

      '&-small': {
        ...genPikerPadding(
          token,
          token.controlHeightSM,
          token.fontSize,
          token.inputPaddingHorizontalSM,
        ),
      },

      [`${componentCls}-suffix`]: {
        display: 'flex',
        flex: 'none',
        alignSelf: 'center',
        marginInlineStart: token.paddingXS / 2,
        color: token.colorTextDisabled,
        lineHeight: 1,
        pointerEvents: 'none',

        '> *': {
          verticalAlign: 'top',
          fontSize: token.fontSizeLG + 4, // 20
          '&:not(:last-child)': {
            marginInlineEnd: token.marginXS,
          },
        },
      },

      [`${componentCls}-clear`]: {
        position: 'absolute',
        top: '50%',
        insetInlineEnd: 0,
        color: token.colorTextDisabled,
        lineHeight: 1,
        background: token.colorBgContainer,
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        opacity: 0,
        transition: `opacity ${token.motionDurationSlow}, color ${token.motionDurationSlow}`,

        '> *': {
          verticalAlign: 'top',
          fontSize: token.fontSizeLG + 4, // 20
        },

        '&:hover': {
          color: token.colorTextDescription,
        },
      },

      [`${componentCls}-separator`]: {
        position: 'relative',
        display: 'inline-block',
        width: token.fontSizeLG * 1.5,
        height: token.fontSizeLG,
        color: token.colorTextDisabled,
        fontSize: token.fontSizeLG,
        verticalAlign: 'top',
        cursor: 'default',

        [`${componentCls}-focused &`]: {
          color: token.colorTextDescription,
        },

        [`${componentCls}-range-separator &`]: {
          [`${componentCls}-disabled &`]: {
            cursor: 'not-allowed',
          },
        },
      },

      // ======================== Range =========================
      '&-range': {
        position: 'relative',
        display: 'inline-flex',

        // Clear
        [`${componentCls}-clear`]: {
          insetInlineEnd: token.inputPaddingHorizontal,
        },

        '&:hover': {
          [`${componentCls}-clear`]: {
            opacity: 1,
          },
        },

        [`${componentCls}-range-separator`]: {
          alignItems: 'center',
          padding: `0 ${token.paddingXS}px`,
          // lineHeight: 1,
        },

        [`&${componentCls}-small`]: {
          [`${componentCls}-clear`]: {
            insetInlineEnd: token.inputPaddingHorizontalSM,
          },
        },
      },

      // ======================= Dropdown =======================
      '&-dropdown': {
        ...resetComponent(token),
        ...genPanelStyle(token),
        position: 'absolute',
        top: -9999,
        left: {
          _skip_check_: true,
          value: -9999,
        },
        zIndex: token.zIndexPopup,
        transformOrigin: 'center bottom',
        outline: 0,
        transition: 'opacity 326ms cubic-bezier(.4, 0, .2, 1) 0ms, transform 217ms cubic-bezier(.4, 0, .2, 1) 0ms',

        '&&-hidden': {
          display: 'none',
        },

        '&&-placement-bottomLeft': {
          [`${componentCls}-range-arrow`]: {
            top: `${token.sizePopupArrow / 2 - token.sizePopupArrow / 3 + 0.7}px`,
            // top: 0,
            display: 'block',
            // transform: 'translateY(-100%)',
            transform: 'rotate(-135deg) translateY(1px)',
          },
        },

        '&&-placement-topLeft': {
          [`${componentCls}-range-arrow`]: {
            // bottom: 0,
            bottom: `${token.sizePopupArrow / 2 - token.sizePopupArrow / 3 + 0.7}px`,
            display: 'block',
            transform: 'rotate(45deg)',
          },
        },

        [`&${muiCls}-slide-up-enter${muiCls}-slide-up-enter-active&-placement-topLeft,
          &${muiCls}-slide-up-enter${muiCls}-slide-up-enter-active&-placement-topRight,
          &${muiCls}-slide-up-appear${muiCls}-slide-up-appear-active&-placement-topLeft,
          &${muiCls}-slide-up-appear${muiCls}-slide-up-appear-active&-placement-topRight`]: {
          animationName: slideDownIn,
        },

        [`&${muiCls}-slide-up-enter${muiCls}-slide-up-enter-active&-placement-bottomLeft,
          &${muiCls}-slide-up-enter${muiCls}-slide-up-enter-active&-placement-bottomRight,
          &${muiCls}-slide-up-appear${muiCls}-slide-up-appear-active&-placement-bottomLeft,
          &${muiCls}-slide-up-appear${muiCls}-slide-up-appear-active&-placement-bottomRight`]: {
          animationName: slideUpIn,
        },

        [`&${muiCls}-slide-up-leave${muiCls}-slide-up-leave-active&-placement-topLeft,
          &${muiCls}-slide-up-leave${muiCls}-slide-up-leave-active&-placement-topRight`]: {
          animationName: slideDownOut,
        },

        [`&${muiCls}-slide-up-leave${muiCls}-slide-up-leave-active&-placement-bottomLeft,
          &${muiCls}-slide-up-leave${muiCls}-slide-up-leave-active&-placement-bottomRight`]: {
          animationName: slideUpOut,
        },

        // Time picker with additional style
        [`${componentCls}-panel > ${componentCls}-time-panel`]: {
          paddingTop: token.paddingXS / 2,
        },

        // ======================== Ranges ========================
        [`${componentCls}-ranges`]: {
          marginBottom: 0,
          padding: `${token.paddingXS / 2}px ${token.paddingSM}px`,
          overflow: 'hidden',
          lineHeight: `${
            token.pickerTextHeight - 2 * token.controlLineWidth - token.paddingXS / 2
          }px`,
          textAlign: 'start',
          listStyle: 'none',
          display: 'flex',
          justifyContent: 'space-between',

          '> li': {
            display: 'inline-block',
            paddingInlineStart: token.paddingXXS,
          },
          [`${componentCls}-preset > ${muiCls}-tag-blue`]: {
            color: token.colorPrimary,
            background: token.controlItemBgActive,
            borderColor: token.colorPrimaryBorder,
            cursor: 'pointer',
          },

          [`${componentCls}-ok`]: {
            marginInlineStart: 'auto',
          },
        },

        [`${componentCls}-range-wrapper`]: {
          display: 'flex',
          position: 'relative',
        },

        [`${componentCls}-range-arrow`]: {
          position: 'absolute',
          zIndex: 1,
          display: 'none',
          marginInlineStart: token.inputPaddingHorizontal * 1.5,
          transition: `left ${token.motionDurationSlow} ease-out`,
          ...roundedArrow(
            token.sizePopupArrow,
            token.radiusXS,
            token.radiusOuter,
            token.colorBgElevated,
            boxShadowPopoverArrow,
          ),
        },

        [`${componentCls}-panel-container`]: {
          overflow: 'hidden',
          verticalAlign: 'top',
          background: token.colorBgElevated,
          borderRadius: token.radiusBase * 3, // 6
          boxShadow: token.boxShadow,
          transition: `margin ${token.motionDurationSlow}`,

          [`${componentCls}-panels`]: {
            display: 'inline-flex',
            flexWrap: 'nowrap',

            '&:last-child': {
              [`${componentCls}-panel`]: {
                borderWidth: 0,
              },
            },
          },

          [`${componentCls}-panel`]: {
            verticalAlign: 'top',
            background: 'transparent',
            borderWidth: `0 0 ${token.controlLineWidth}px`,
            borderRadius: 0,

            [`${componentCls}-content,
            table`]: {
              textAlign: 'center',
            },

            '&-focused': {
              borderColor: token.colorBorder,
            },
          },
        },
      },

      '&-dropdown-range': {
        padding: `${(token.sizePopupArrow * 2) / 3}px 0`,

        '&-hidden': {
          display: 'none',
        },
      },
    },
    [`${componentCls}-has-label`]: {
      [`${componentCls}-label`]: {
        ...genLabelStyle(token),
      },
      [`${componentCls}-input >input`]: {
        '&::-webkit-input-placeholder': {
          color: 'transparent',
        },
        '&::-moz-input-placeholder': {
          color: 'transparent',
        },
        'input:placeholder': {
          color: 'transparent',
        },
      },
    },
    [`${componentCls}-shrink`]: {
      ...genShrinkStyle(token),
    },
  }
}

export const initPickerPanelToken = (token: TokenWithCommonCls<GlobalToken>): PickerPanelToken => {
  const pickerTimePanelCellHeight = 28

  return {
    pickerCellInnerCls: `${token.componentCls}-cell-inner`,
    pickerTextHeight: token.controlHeightLG,
    pickerPanelCellWidth: token.controlHeightSM * 1.5,
    pickerPanelCellHeight: token.controlHeightSM,
    pickerDateHoverRangeBorderColor: new TinyColor(token.colorPrimary).lighten(20).toHexString(),
    pickerBasicCellHoverWithRangeColor: new TinyColor(token.colorPrimary).lighten(35).toHexString(),
    pickerPanelWithoutTimeCellHeight: token.controlHeightLG * 1.65,
    pickerYearMonthCellWidth: token.controlHeightLG * 1.5,
    pickerTimePanelColumnHeight: pickerTimePanelCellHeight * 8,
    pickerTimePanelColumnWidth: token.controlHeightLG * 1.4,
    pickerTimePanelCellHeight,
    pickerQuarterPanelContentHeight: token.controlHeightLG * 1.4,
    pickerCellPaddingVertical: token.paddingXXS,
    pickerCellBorderGap: 2, // Magic for gap between cells
    pickerControlIconSize: 7,
    pickerControlIconBorderWidth: 1.5,
  }
}

// ============================== Export ==============================
export default genComponentStyleHook(
  'DatePicker',
  token => {
    const { componentCls } = token
    const pickerToken = mergeToken<PickerToken>(
      initInputToken<FullToken<'DatePicker'>>(token),
      initPickerPanelToken(token),
    )
    return [
      genPickerStyle(pickerToken),
      genOutlinedStyle(pickerToken),
      {
        [`${componentCls}-shrink`]: {
          ...genShrinkStyle(pickerToken),
        },
      },
      {
        [`${componentCls}-focused`]: {
          ...genActiveStyle(pickerToken),
          ...genOutlinedActiveStyle(pickerToken),
          borderColor: 'transparent',
        },
      },
      // need back to shrink
      genPickerStatusStyle(
        `${componentCls}-status-error`,
        mergeToken<any>(token, {
          outlineColor: token.colorError,
          borderWidth: token.controlLineWidth + 1,
        })
      ),
      genPickerStatusStyle(
        `${componentCls}-status-warning`,
        mergeToken<any>(token, {
          outlineColor: token.colorWarning,
          borderWidth: token.controlLineWidth + 1,
        })
      ),
    ]
  },
  token => ({
    zIndexPopup: token.zIndexPopupBase + 50,
    circleBorderRadius: '50%',
  }),
)
