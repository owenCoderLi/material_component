import type { CSSObject } from '@developerli/styled';
import type { DerivativeToken } from '../theme';

export { operationUnit } from './operationUnit';
export { roundedArrow } from './roundedArrow';

export const resetComponent = (token: DerivativeToken): CSSObject => ({
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
  color: token.colorText,
  fontSize: token.fontSize,
  lineHeight: token.lineHeight,
  listStyle: 'none',
  fontFamily: token.fontFamily,
});

export const resetIcon = (): CSSObject => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: 'inherit',
  fontStyle: 'normal',
  lineHeight: 0,
  textAlign: 'center',
  textTransform: 'none',
  verticalAlign: '-0.125em',
  textRendering: 'optimizeLegibility',
  '-webkit-font-smoothing': 'antialiased',
  '-moz-osx-font-smoothing': 'grayscale',

  '> *': {
    lineHeight: 1,
  },

  svg: {
    display: 'inline-block',
  },

  '& &-icon': {
    display: 'block',
  },
});

export const clearFix = (): CSSObject => ({
  '&::before': {
    display: 'table',
    content: '""',
  },

  '&::after': {
    display: 'table',
    clear: 'both',
    content: '""',
  },
});

export const genLinkStyle = (token: DerivativeToken): CSSObject => ({
  a: {
    color: token.colorLink,
    textDecoration: token.linkDecoration,
    backgroundColor: 'transparent', // remove the gray background on active links in IE 10.
    outline: 'none',
    cursor: 'pointer',
    transition: `color ${token.motionDurationSlow}`,
    '-webkit-text-decoration-skip': 'objects', // remove gaps in links underline in iOS 8+ and Safari 8+.

    '&:hover': {
      color: token.colorLinkHover,
    },

    '&:active': {
      color: token.colorLinkActive,
    },

    [`&:active, &:hover`]: {
      textDecoration: token.linkHoverDecoration,
      outline: 0,
    },
    '&:focus': {
      textDecoration: token.linkFocusDecoration,
      outline: 0,
    },

    '&[disabled]': {
      color: token.colorTextDisabled,
      cursor: 'not-allowed',
    },
  },
});

export const genFontStyle = (token: DerivativeToken, rootPrefixCls: string) => {
  const { fontFamily, fontSize } = token;

  return {
    [`[class^="${rootPrefixCls}-"], [class*=" ${rootPrefixCls}-"]`]: {
      fontFamily,
      fontSize,
    },
  };
};

export const genFocusOutline = (token: DerivativeToken): CSSObject => ({
  outline: `${token.lineWidth * 4}px solid ${token.colorPrimaryBorder}`,
  outlineOffset: 1,
  transition: 'outline-offset 0s, outline 0s',
});

export const genFocusStyle = (token: DerivativeToken): CSSObject => ({
  '&:focus-visible': {
    ...genFocusOutline(token),
  },
});
