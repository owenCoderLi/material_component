import type { CSSInterpolation } from '@developerli/styled';
import { useStyleRegister } from '@developerli/styled';
import { useContext } from 'react';
import { genFontStyle, genLinkStyle } from '../../style';
import { ConfigContext } from '../../Provider/context';
import type { UseComponentStyleResult } from '../index';
import { mergeToken, statisticToken, useToken } from '../index';
import type { ComponentTokenMap, GlobalToken } from '../interface';

export type OverrideTokenWithoutDerivative = ComponentTokenMap;
export type OverrideComponent = keyof OverrideTokenWithoutDerivative;
export type GlobalTokenWithComponent<ComponentName extends OverrideComponent> = GlobalToken &
  ComponentTokenMap[ComponentName];

export interface StyleInfo<ComponentName extends OverrideComponent> {
  hashId: string;
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls: string;
  overrideComponentToken: ComponentTokenMap[ComponentName];
}

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string;
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string;
  /** Wrap icon class with `.` prefix */
  iconCls: string;
  /** Wrap ant prefixCls class with `.` prefix */
  muiCls: string;
};
export type FullToken<ComponentName extends OverrideComponent> = TokenWithCommonCls<
  GlobalTokenWithComponent<ComponentName>
>;

export default function genComponentStyleHook<ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (token: FullToken<ComponentName>, info: StyleInfo<ComponentName>) => CSSInterpolation,
  getDefaultToken?:
    | OverrideTokenWithoutDerivative[ComponentName]
    | ((token: GlobalToken) => OverrideTokenWithoutDerivative[ComponentName]),
) {
  return (prefixCls: string): UseComponentStyleResult => {
    const [theme, token, hashId] = useToken();
    const { getPrefixCls, iconPrefixCls } = useContext(ConfigContext);
    const rootPrefixCls = getPrefixCls();

    // Generate style for all a tags in component.
    useStyleRegister({ theme, token, hashId, path: ['Shared', rootPrefixCls] }, () => [
      {
        // Link
        '&': genLinkStyle(token),
      },
      genFontStyle(token, rootPrefixCls),
    ]);

    return [
      // @ts-ignore
      useStyleRegister(
        { theme, token, hashId, path: [component, prefixCls, iconPrefixCls] },
        () => {
          const { token: proxyToken, flush } = statisticToken(token);

          const defaultComponentToken = typeof getDefaultToken === 'function'
            // @ts-ignore
            ? getDefaultToken(proxyToken)
            : getDefaultToken;
          const mergedComponentToken = { ...defaultComponentToken, ...token[component] };

          const componentCls = `.${prefixCls}`;
          const mergedToken = mergeToken<
            TokenWithCommonCls<GlobalTokenWithComponent<OverrideComponent>>
          >(
            proxyToken,
            {
              componentCls,
              prefixCls,
              iconCls: `.${iconPrefixCls}`,
              muiCls: `.${rootPrefixCls}`,
            },
            mergedComponentToken,
          );

          const styleInterpolation = styleFn(mergedToken as unknown as FullToken<ComponentName>, {
            hashId,
            prefixCls,
            rootPrefixCls,
            iconPrefixCls,
            overrideComponentToken: token[component],
          });
          flush(component, mergedComponentToken);
          return styleInterpolation;
        },
      ),
      hashId,
    ];
  };
}
