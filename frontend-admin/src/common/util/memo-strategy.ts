import {
  type ComponentProps,
  type ComponentType,
  type MemoExoticComponent,
  memo,
} from 'react'

export const memoStrategy = <T extends ComponentType<ComponentProps<T>>>(
  Component: T,
  equals: (
    prevProps: Readonly<ComponentProps<T>>,
    nextProps: Readonly<ComponentProps<T>>,
  ) => boolean,
): MemoExoticComponent<T> =>
  memo(Component, equals) as unknown as MemoExoticComponent<T>
