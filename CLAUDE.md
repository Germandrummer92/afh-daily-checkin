# Daily Check-In

## Development Practice

**All production code MUST be written using TDD (Red, Green, Refactor):**

1. **Red** — Write a failing test first that describes the desired behavior.
2. **Green** — Write the minimum production code to make the test pass.
3. **Refactor** — Clean up the code while keeping all tests green.

No production code is written without a corresponding test driving it.

## SQL Style

- All SQL keywords MUST be uppercase (e.g. `SELECT`, `CREATE TABLE`, `NOT NULL`, `REFERENCES`)

## Commands

- `pnpm start` — run the full application (frontend + backend)
- `pnpm build` — compile TypeScript
- `pnpm typecheck` — type-check without emitting (`tsc --noEmit`)
- `pnpm lint` — run Biome linter
- `pnpm lint:fix` — run Biome linter with auto-fix

## Design System

This app follows the visual identity of [actionforhappiness.org](https://actionforhappiness.org/).

### Colors

CSS custom property names from the AFH site are listed for reference.

| Token            | Hex       | Usage                              |
| ---------------- | --------- | ---------------------------------- |
| `--crimson`      | `#db2350` | Primary brand red, CTA buttons     |
| `--orange`       | `#fcc512` | Accent yellow/gold                 |
| `--dark-orange`  | `#d35e0f` | Secondary orange                   |
| `--orange-2`     | `#ef940f` | Alternate orange                   |
| `--plum`         | `#ff474f` | Warm red accent                    |
| `--plum-2`       | `#ff908e` | Light warm accent                  |
| `--ggreen`       | `#00693b` | Deep green                         |
| `--yellow-green` | `#89ca3b` | Bright green accent                |
| `--yellow-green-2` | `#cbd543` | Light green accent              |
| `--yellow-green-3` | `#6da742` | Mid green                       |
| `--light-sky-blue` | `#1d77bd` | Primary blue                    |
| `--sky-blue-2`   | `#4ea3cf` | Secondary blue                     |
| `--light-blue-2` | `#80cbd8` | Soft blue                          |
| `--dodger-blue`  | `#0c5572` | Dark teal                          |
| `--black`        | `#392e44` | Body text (dark purple-charcoal)   |
| `--white`        | `#ffffff` | Backgrounds                        |
| `--linen`        | `#f1f1f1` | Light background                   |
| `--gainsboro`    | `#f3f3f3` | Alternate light background         |

### Typography

- **Primary font:** Campton (weights 300 light, 700 bold)
- **Fallback:** Arial, sans-serif
- The AFH site also loads Spartan and Roboto Slab via Google Fonts as secondary faces

### Component Patterns

- **Border radius:** `5px` standard, `100px`/`1000px` for pill shapes
- **Buttons:** crimson background, white text, `5px` radius, subtle scale-down on hover (`transform: scale(0.95)`)
- **Cards:** white background, `box-shadow: 0 15px 20px -10px rgba(0,0,0,0.2)`
- **Overall feel:** warm, friendly, rounded, light backgrounds with pops of colour
