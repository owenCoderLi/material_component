import type { CSSInterpolation } from '@developerli/styled';
import { Keyframes } from '@developerli/styled';
import type { AliasToken } from '../../theme';
import type { TokenWithCommonCls } from '../../theme/utils/genComponentStyleHook';
import { initMotion } from './motion';

export const fadeIn = new Keyframes('antFadeIn', {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

export const fadeOut = new Keyframes('antFadeOut', {
  '0%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

export const initFadeMotion = (token: TokenWithCommonCls<AliasToken>): CSSInterpolation => {
  const { muiCls } = token;
  const motionCls = `${muiCls}-fade`;

  return [
    initMotion(motionCls, fadeIn, fadeOut, token.motionDurationMid),
    {
      [`
        ${motionCls}-enter,
        ${motionCls}-appear
      `]: {
        opacity: 0,
        animationTimingFunction: 'linear',
      },

      [`${motionCls}-leave`]: {
        animationTimingFunction: 'linear',
      },
    },
  ];
};
