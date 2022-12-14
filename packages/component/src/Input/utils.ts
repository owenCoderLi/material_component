import type { ClearableInputProps } from './ClearableLabelInput'
import type { InputProps } from './Input'

// eslint-disable-next-line import/prefer-default-export
export function hasPrefixSuffix(props: InputProps | ClearableInputProps) {
  return !!(props.prefix || props.suffix || props.allowClear)
}
