import { render } from 'ink'

import { AppProgram } from './program'

// tea-cup-pagination scrolls the page back to the top after each fetch
// (`window.scrollTo`, or the element `document.getElementById` finds). A
// terminal has no page: both do nothing here.
Object.assign(globalThis, {
  window: { scrollTo: () => undefined },
  document: { getElementById: () => null },
})

render(<AppProgram />)
