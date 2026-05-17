import {
  type TextPillTypeUiArg,
  type TextTypeUiArg,
  autocompleteToString,
  textInputVariantToString,
} from '@rinn7e/tea-cup-form'
import { cn } from '@rinn7e/tea-cup-prelude'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Eye, EyeOff, X } from 'lucide-react'
import React from 'react'

export type ExtraTextInputProps = {
  isSmall?: boolean
  isTag?: boolean
  testId?: string
}

export const standardInputUi =
  (extra: ExtraTextInputProps = {}) =>
  (props: TextTypeUiArg) => {
    const isSmall = extra.isSmall ?? false
    const isError = E.isLeft(props.validationResult) && props.showValidation
    const sizeClass = isSmall ? 'py-[8px] text-sm' : 'py-[12px] text-base'
    const validationClass = isError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
    const testId = extra.testId ?? props.key + '-input'
    const inputClass = cn(
      'w-full rounded border px-[12px] bg-white outline-none focus:ring-1 transition-colors',
      validationClass,
      sizeClass,
    )

    const onKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (extra.isTag && e.key === 'Enter') {
        e.preventDefault()
        props.dispatch({
          _tag: 'UpdateFormManual',
          key: props.key,
          value: props.currentValue + ', ',
        })
      }
      props.onKeyDown?.(e)
    }

    const variant = props.variant

    const content = props.isTextarea ? (
      <textarea
        name={props.key}
        data-test={testId}
        autoComplete={autocompleteToString(props.autocomplete)}
        className={cn(inputClass, 'resize-none')}
        rows={8}
        placeholder={props.placeholder}
        value={props.currentValue}
        onChange={(e) =>
          props.dispatch({
            _tag: 'UpdateForm',
            key: props.key,
            event: e as unknown as React.ChangeEvent<HTMLInputElement>,
          })
        }
        onFocus={() =>
          props.dispatch({
            _tag: 'HandleFocus',
            key: props.key,
            isFocus: true,
          })
        }
        onBlur={() =>
          props.dispatch({
            _tag: 'HandleFocus',
            key: props.key,
            isFocus: false,
          })
        }
        onKeyDown={onKeyDown}
      />
    ) : (
      <div className='relative flex items-center'>
        <input
          name={props.key}
          data-test={testId}
          autoComplete={autocompleteToString(props.autocomplete)}
          className={cn(inputClass, variant._tag === 'Password' && 'pr-[40px]')}
          type={textInputVariantToString(variant)}
          placeholder={props.placeholder}
          value={props.currentValue}
          onInput={(e) =>
            props.dispatch({
              _tag: 'UpdateForm',
              key: props.key,
              event: e as unknown as React.ChangeEvent<HTMLInputElement>,
            })
          }
          onFocus={() =>
            props.dispatch({
              _tag: 'HandleFocus',
              key: props.key,
              isFocus: true,
            })
          }
          onBlur={() =>
            props.dispatch({
              _tag: 'HandleFocus',
              key: props.key,
              isFocus: false,
            })
          }
          onKeyDown={onKeyDown}
        />
        {variant._tag === 'Password' && (
          <button
            type='button'
            className='absolute right-[6px] flex items-center justify-center p-2 text-gray-500 transition-colors hover:text-gray-700'
            onClick={(e) =>
              props.dispatch({
                _tag: 'SetRevealPassword',
                key: props.key,
                reveal: !variant.reveal,
                event: e,
              })
            }
          >
            {variant.reveal ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    )

    return (
      <div className='flex flex-col gap-[4px] pb-[16px]'>
        {content}
        {props.showValidation &&
          pipe(
            props.validationResult,
            E.fold(
              (err) => (
                <div
                  data-test='fe-input-error'
                  className='px-[4px] text-xs text-red-600'
                >
                  {err}
                </div>
              ),
              () => null,
            ),
          )}
      </div>
    )
  }

export const textPillInputUi =
  (extra: ExtraTextInputProps = {}) =>
  (props: TextPillTypeUiArg) => {
    const isSmall = extra.isSmall ?? false
    const isError = E.isLeft(props.validationResult) && props.showValidation
    const sizeClass = isSmall ? 'py-[4px] text-sm' : 'py-[6px] text-base'
    const validationClass = isError
      ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
      : 'border-gray-300 focus-within:border-green-500 focus-within:ring-green-500'

    const containerClass = cn(
      'flex flex-wrap items-center gap-[6px] w-full rounded border px-[12px] bg-white outline-none focus-within:ring-1 transition-colors min-h-[46px]',
      validationClass,
    )

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        (e.key === 'Enter' || e.key === ',') &&
        props.currentValue.trim() !== ''
      ) {
        e.preventDefault()
        props.dispatch({
          _tag: 'TextPillMsg',
          key: props.key,
          subMsg: { _tag: 'AddPill', value: props.currentValue.trim() },
        })
      }
      if (
        e.key === 'Backspace' &&
        props.currentValue === '' &&
        props.allValues.length > 0
      ) {
        props.dispatch({
          _tag: 'TextPillMsg',
          key: props.key,
          subMsg: { _tag: 'RemovePill', index: props.allValues.length - 1 },
        })
      }
    }

    return (
      <div className='flex flex-col gap-[4px] pb-[16px]'>
        <div className={containerClass}>
          {props.allValues.map((tag: string, index: number) => (
            <span
              key={`${tag}-${index}`}
              className='flex items-center gap-[4px] rounded-full bg-gray-200 px-[8px] py-[2px] text-sm text-gray-700'
              data-test='tag-pill'
            >
              {tag}
              <button
                type='button'
                className='transition-colors hover:text-red-500'
                onClick={() =>
                  props.dispatch({
                    _tag: 'TextPillMsg',
                    key: props.key,
                    subMsg: { _tag: 'RemovePill', index },
                  })
                }
              >
                <i>
                  <X size={14} />
                </i>
              </button>
            </span>
          ))}
          <input
            name={props.key}
            data-test={extra.testId ?? props.key + '-input'}
            autoComplete={autocompleteToString(props.autocomplete)}
            className={cn('flex-1 bg-transparent outline-none', sizeClass)}
            placeholder={props.placeholder}
            value={props.currentValue}
            onInput={(e) =>
              props.dispatch({
                _tag: 'TextPillMsg',
                key: props.key,
                subMsg: {
                  _tag: 'UpdateTextPill',
                  event: e as unknown as React.FormEvent<HTMLInputElement>,
                },
              })
            }
            onFocus={() =>
              props.dispatch({
                _tag: 'HandleFocus',
                key: props.key,
                isFocus: true,
              })
            }
            onBlur={() =>
              props.dispatch({
                _tag: 'HandleFocus',
                key: props.key,
                isFocus: false,
              })
            }
            onKeyDown={onKeyDown}
          />
        </div>
        {props.showValidation &&
          pipe(
            props.validationResult,
            E.fold(
              (err) => (
                <div
                  data-test='fe-input-error'
                  className='px-[4px] text-xs text-red-600'
                >
                  {err}
                </div>
              ),
              () => null,
            ),
          )}
      </div>
    )
  }
