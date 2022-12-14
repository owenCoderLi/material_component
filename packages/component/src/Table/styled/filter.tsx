import type { GenerateStyle } from '../../theme'
import type { TableToken } from './index'
import { resetComponent } from '../../style'

const genFilterStyle: GenerateStyle<TableToken> = token => {
  const {
    componentCls,
    muiCls,
    iconCls,
    tableFilterDropdownWidth,
    tableFilterDropdownSearchWidth,
    paddingXXS,
    paddingXS,
    lineWidth,
    colorText,
    controlLineWidth,
    controlLineType,
    tableBorderColor,
    tableHeaderIconColor,
    fontSizeSM,
    tablePaddingHorizontal,
    radiusBase,
    motionDurationSlow,
    colorTextDescription,
    colorPrimary,
    colorPrimaryActive,
    tableHeaderFilterActiveBg,
    colorTextDisabled,
    tableFilterDropdownBg,
    tableFilterDropdownHeight,
    controlItemBgHover,
    boxShadow,
  } = token
  const dropdownPrefixCls = `${muiCls}-dropdown`
  const tableFilterDropdownPrefixCls = `${componentCls}-filter-dropdown`
  const treePrefixCls = `${muiCls}-tree`
  const tableBorder = `${controlLineWidth}px ${controlLineType} ${tableBorderColor}`

  return [
    {
      [`${componentCls}-wrapper`]: {
        [`${componentCls}-filter-column`]: {
          display: 'flex',
          justifyContent: 'space-between',
        },

        [`${componentCls}-filter-trigger`]: {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          marginBlock: -paddingXXS,
          marginInline: `${paddingXXS}px ${-tablePaddingHorizontal / 2}px`,
          padding: `0 ${paddingXXS}px`,
          color: tableHeaderIconColor,
          fontSize: fontSizeSM,
          borderRadius: radiusBase,
          cursor: 'pointer',
          transition: `all ${motionDurationSlow}`,

          '&:hover': {
            color: colorTextDescription,
            background: tableHeaderFilterActiveBg,
          },

          '&.active': {
            color: colorPrimary,
          },
        },
      },
    },
    {
      // Dropdown
      [`${muiCls}-dropdown`]: {
        [tableFilterDropdownPrefixCls]: {
          ...resetComponent(token),

          minWidth: tableFilterDropdownWidth,
          backgroundColor: tableFilterDropdownBg,
          borderRadius: radiusBase,
          boxShadow,

          // Reset menu
          [`${dropdownPrefixCls}-menu`]: {
            maxHeight: tableFilterDropdownHeight,
            overflowX: 'hidden',
            border: 0,
            boxShadow: 'none',

            '&:empty::after': {
              display: 'block',
              padding: `${paddingXS}px 0`,
              color: colorTextDisabled,
              fontSize: fontSizeSM,
              textAlign: 'center',
              content: '"Not Found"',
            },
          },

          [`${tableFilterDropdownPrefixCls}-tree`]: {
            paddingBlock: `${paddingXS}px 0`,
            paddingInline: paddingXS,

            [treePrefixCls]: {
              padding: 0,
            },

            [`${treePrefixCls}-treenode ${treePrefixCls}-node-content-wrapper:hover`]: {
              backgroundColor: controlItemBgHover,
            },

            [`${treePrefixCls}-treenode-checkbox-checked ${treePrefixCls}-node-content-wrapper`]: {
              '&, &:hover': {
                backgroundColor: colorPrimaryActive,
              },
            },
          },

          [`${tableFilterDropdownPrefixCls}-search`]: {
            padding: paddingXS,
            borderBottom: tableBorder,

            '&-input': {
              input: {
                minWidth: tableFilterDropdownSearchWidth,
              },
              [iconCls]: {
                color: colorTextDisabled,
              },
            },
          },

          [`${tableFilterDropdownPrefixCls}-checkall`]: {
            width: '100%',
            marginBottom: paddingXXS,
            marginInlineStart: paddingXXS,
          },

          // Operation
          [`${tableFilterDropdownPrefixCls}-btns`]: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: `${paddingXS - lineWidth}px ${paddingXS}px`,
            overflow: 'hidden',
            backgroundColor: 'inherit',
            borderTop: tableBorder,
          },
        },
      },
    },
    // Dropdown Menu & SubMenu
    {
      // submenu of table filter dropdown
      [`${muiCls}-dropdown ${tableFilterDropdownPrefixCls}, ${tableFilterDropdownPrefixCls}-submenu`]:
        {
          // Checkbox
          [`${muiCls}-checkbox-wrapper + span`]: {
            paddingInlineStart: paddingXS,
            color: colorText,
          },

          [`> ul`]: {
            maxHeight: 'calc(100vh - 130px)',
            overflowX: 'hidden',
            overflowY: 'auto',
          },
        },
    },
  ]
}

export default genFilterStyle
