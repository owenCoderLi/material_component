import * as React from 'react'
import classNames from 'classnames'
import omit from 'rc-util/lib/omit'
import { ConfigContext } from '../Provider'
import DisabledContext from '../Provider/DisabledContext'
import type { SizeType } from '../Provider/SizeContext'
import SizeContext from '../Provider/SizeContext'
import { cloneElement } from '../utils/reactNode'
import { tuple } from '../utils/type'
import Group, { GroupSizeContext } from './ButtonGroup'
import LoadingIcon from './LoadingIcon'

// CSSINJS
import useStyle from './styled'

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)
function isString(str: any) {
  return typeof str === 'string'
}

function isUnBorderedButtonType(type: ButtonType | undefined) {
  return type === 'text' || type === 'link'
}

function isReactFragment(node: React.ReactNode) {
  return React.isValidElement(node) && node.type === React.Fragment
}

// Insert one space between two chinese characters automatically.
function insertSpace(child: React.ReactElement | string | number, needInserted: boolean) {
  // Check the child if is undefined or null.
  if (child === null || child === undefined) {
    return
  }
  const SPACE = needInserted ? ' ' : ''
  // strictNullChecks oops.
  if (
    typeof child !== 'string' &&
    typeof child !== 'number' &&
    isString(child.type) &&
    isTwoCNChar(child.props.children)
  ) {
    return cloneElement(child, {
      children: child.props.children.split('').join(SPACE),
    })
  }
  if (typeof child === 'string') {
    return isTwoCNChar(child) ? <span>{child.split('').join(SPACE)}</span> : <span>{child}</span>
  }
  if (isReactFragment(child)) {
    return <span>{child}</span>
  }
  return child
}

function spaceChildren(children: React.ReactNode, needInserted: boolean) {
  let isPrevChildPure: boolean = false
  const childList: React.ReactNode[] = []
  React.Children.forEach(children, child => {
    const type = typeof child
    const isCurrentChildPure = type === 'string' || type === 'number'
    if (isPrevChildPure && isCurrentChildPure) {
      const lastIndex = childList.length - 1
      const lastChild = childList[lastIndex]
      childList[lastIndex] = `${lastChild}${child}`
    } else {
      childList.push(child)
    }

    isPrevChildPure = isCurrentChildPure
  })

  // Pass to React.Children.map to auto fill key
  return React.Children.map(childList, child =>
    insertSpace(child as React.ReactElement | string | number, needInserted),
  )
}

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'link', 'text')
export type ButtonType = typeof ButtonTypes[number]
const ButtonShapes = tuple('default', 'circle', 'round')
export type ButtonShape = typeof ButtonShapes[number]
const ButtonHTMLTypes = tuple('submit', 'button', 'reset')
export type ButtonHTMLType = typeof ButtonHTMLTypes[number]

export type LegacyButtonType = ButtonType | 'danger'
export function convertLegacyProps(type?: LegacyButtonType): ButtonProps {
  if (type === 'danger') {
    return { danger: true }
  }
  return { type }
}

export interface BaseButtonProps {
  type?: ButtonType
  icon?: React.ReactNode
  /**
   * Shape of Button
   *
   * @default default
   */
  shape?: ButtonShape
  size?: SizeType
  disabled?: boolean
  loading?: boolean | { delay?: number }
  prefixCls?: string
  className?: string
  ghost?: boolean
  danger?: boolean
  block?: boolean
  children?: React.ReactNode
}

export type AnchorButtonProps = {
  href: string
  target?: string
  onClick?: React.MouseEventHandler<HTMLElement>
} & BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType
  onClick?: React.MouseEventHandler<HTMLElement>
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLElement>> {
  Group: typeof Group
  /** @internal */
  __MUI_BUTTON: boolean
}

type Loading = number | boolean

const InternalButton: React.ForwardRefRenderFunction<unknown, ButtonProps> = (props, ref) => {
  const {
    loading = false,
    prefixCls: customizePrefixCls,
    type = 'default',
    danger,
    shape = 'default',
    size: customizeSize,
    disabled: customDisabled,
    className,
    children,
    icon,
    ghost = false,
    block = false,
    htmlType = 'button' as ButtonProps['htmlType'],
    ...rest
  } = props

  const { getPrefixCls } = React.useContext(ConfigContext)
  const prefixCls = getPrefixCls('btn', customizePrefixCls)

  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls)

  const size = React.useContext(SizeContext)
  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext)
  const mergedDisabled = customDisabled ?? disabled

  const groupSize = React.useContext(GroupSizeContext)
  const [innerLoading, setLoading] = React.useState<Loading>(!!loading)
  const [hasTwoCNChar, setHasTwoCNChar] = React.useState(false)
  const buttonRef = (ref as any) || React.createRef<HTMLElement>()

  const isNeedInserted = () =>
    React.Children.count(children) === 1 && !icon && !isUnBorderedButtonType(type)

  const fixTwoCNChar = () => {
    // Fix for HOC usage like <FormatMessage />
    if (!buttonRef || !buttonRef.current) {
      return
    }
    const buttonText = buttonRef.current.textContent
    if (isNeedInserted() && isTwoCNChar(buttonText)) {
      if (!hasTwoCNChar) {
        setHasTwoCNChar(true)
      }
    } else if (hasTwoCNChar) {
      setHasTwoCNChar(false)
    }
  }

  // =============== Update Loading ===============
  const loadingOrDelay: Loading = typeof loading === 'boolean' ? loading : loading?.delay || true

  React.useEffect(() => {
    let delayTimer: number | null = null

    if (typeof loadingOrDelay === 'number') {
      delayTimer = window.setTimeout(() => {
        delayTimer = null
        setLoading(loadingOrDelay)
      }, loadingOrDelay)
    } else {
      setLoading(loadingOrDelay)
    }

    return () => {
      if (delayTimer) {
        // in order to not perform a React state update on an unmounted component
        // and clear timer after 'loadingOrDelay' updated.
        window.clearTimeout(delayTimer)
        delayTimer = null
      }
    }
  }, [loadingOrDelay])

  React.useEffect(fixTwoCNChar, [buttonRef])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick } = props
    if (innerLoading || mergedDisabled) {
      e.preventDefault()
      return
    }
    (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e)
  }

  // @ts-ignore
  const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined }
  const sizeFullname = groupSize || customizeSize || size
  const sizeCls = sizeFullname ? sizeClassNameMap[sizeFullname] || '' : ''

  const iconType = innerLoading ? 'loading' : icon

  const linkButtonRestProps = omit(rest as AnchorButtonProps & { navigate: any }, ['navigate'])

  const classes = classNames(
    prefixCls,
    hashId,
    {
      [`${prefixCls}-${shape}`]: shape !== 'default' && shape, // Note: Shape also has `default`
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && !innerLoading,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-dangerous`]: !!danger,
      [`${prefixCls}-disabled`]: linkButtonRestProps.href !== undefined && mergedDisabled,
    },
    className,
  )

  const iconNode =
    icon && !innerLoading ? (
      icon
    ) : (
      <LoadingIcon existIcon={!!icon} prefixCls={prefixCls} loading={!!innerLoading} />
    )

  const kids =
    children || children === 0
      ? spaceChildren(children, isNeedInserted())
      : null

  if (linkButtonRestProps.href !== undefined) {
    return wrapSSR(
      <a {...linkButtonRestProps} className={classes} onClick={handleClick} ref={buttonRef}>
        {iconNode}
        {kids}
      </a>,
    )
  }

  let buttonNode = (
    <button
      {...(rest as NativeButtonProps)}
      type={htmlType}
      className={classes}
      onClick={handleClick}
      disabled={mergedDisabled}
      ref={buttonRef}
    >
      {iconNode}
      {kids}
    </button>
  )

  return wrapSSR(buttonNode)
}

const Button = React.forwardRef<unknown, ButtonProps>(InternalButton) as CompoundedComponent

Button.displayName = 'Button'

Button.Group = Group
Button.__MUI_BUTTON = true

export default Button
