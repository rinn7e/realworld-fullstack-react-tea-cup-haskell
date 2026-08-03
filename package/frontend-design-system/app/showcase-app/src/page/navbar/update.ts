import { Menu, Pencil, Settings } from 'lucide-react'
import React from 'react'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  return [
    {
      showCode: true,
      navbarModel: {
        brandNavItem: {
          key: 'brand',
          label: 'conduit',
          href: '#',
          isActive: false,
          onClick: 'nav:brand',
        },
        desktopNavItems: [
          {
            key: 'home',
            label: 'Home',
            href: '#',
            isActive: true,
            onClick: 'nav:home',
          },
          {
            key: 'editor',
            label: 'New Article',
            href: '#',
            isActive: false,
            onClick: 'nav:editor',
            icon: React.createElement(Pencil, { size: 14 }),
          },
          {
            key: 'settings',
            label: 'Settings',
            href: '#',
            isActive: false,
            onClick: 'nav:settings',
            icon: React.createElement(Settings, { size: 14 }),
          },
        ],
        mobileNavItems: [
          {
            key: 'menu',
            label: '',
            href: '#',
            isActive: false,
            onClick: 'nav:mobile-menu',
            icon: React.createElement(Menu, { size: 24 }),
          },
        ],
      },
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'NavbarMsg': {
      console.log('Showcase nav clicked:', msg.msg)
      return [model, Cmd.none()]
    }
  }
}
