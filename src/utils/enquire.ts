import { prompt } from 'enquirer'
import { padEnd } from 'lodash'
import { blue } from './print'
import { EnquiringError } from './errors'

export interface SelectOption<T> {
  value: T
  label: string
  desc?: string
  disabled?: boolean
}

export interface SelectProps<T> {
  key: string
  value?: T
  preset?: T
  title: string
  options: SelectOption<T>[]
}

export async function select<T>(props: SelectProps<T>): Promise<T> {
  const { key, value, preset, title } = props
  const options = props.options.filter(i => i.disabled !== true)
  if (options.length == 0) {
    throw new EnquiringError(
      EnquiringError.SELECTING_OPTIONS_EMPTY,
      `Selecting options of enquiring "${key}" is empty.`
    )
  }
  if (options.length == 1) {
    return options[0].value
  }
  if (value) {
    for (const option of options) {
      if (option.value === value) {
        return option.value
      }
    }
  }
  let enableIndex: number | undefined = undefined
  let presetIndex: number | undefined = undefined
  let maxLabelLength: number = 0
  for (let i = 0; i < options.length; i++) {
    const option = options[i]
    if (enableIndex === undefined) {
      enableIndex = i
    }
    if (presetIndex === undefined && option.value === preset) {
      presetIndex = i
    }
    if (option.label.length > maxLabelLength) {
      maxLabelLength = option.label.length
    }
  }
  const result = await prompt<Record<string, T>>([
    {
      type: 'select',
      name: key,
      message: title,
      required: true,
      initial: presetIndex ?? enableIndex,
      choices: options.map(item => ({
        name: item.label,
        value: item.value,
        message: item.desc
          ? `${blue(padEnd(item.label, maxLabelLength + 2))} ${item.desc}`
          : item.label
      }))
    }
  ])
  return result[key]
}

export interface InputProps {
  key: string
  value?: string
  preset?: string
  title: string
  output?: (str: string) => string
  validate?: (str: string) => boolean
}

export async function input({
  key,
  value,
  preset,
  title,
  output,
  validate
}: InputProps): Promise<string> {
  if (value) {
    return output ? output(value) : value
  }
  const result = await prompt<Record<string, string>>([
    {
      type: 'input',
      name: key,
      message: title,
      required: true,
      initial: preset,
      result: output,
      validate
    }
  ])
  return result[key]
}
