# Template Development Guide
This guide explains how to make a base9 for you favorite app from both design
and development stand point.

In order to be endored by the base9-theme organization, you should follow this
guide as close as possible.

The guide will assume it's a dark theme.

## Theme Design

Try to follow the following design guide becuase it will make the theme more
consistent with other base9 themes.

This only provides a guideline at a high level. For more detailed design guide,
try to be consistent with the following base9 theme in order of proiorty:
- vscode
- TODO

### What color to pick
[This file](https://github.com/base9-theme/base9-core/blob/main/src/semantic.json)
has the list of variables available to use in mustache.

TODO: explain how this file works.

You should choose a variable that closest to the purpose of where you use
it.

Generally, most of interactable UI element should be `primary` and most other
interactable UI elements should be `secondary`.
Most non-interactable UI elements should be `foreground`.

Avoid using absolute and relative colors in the same place, since there might be
color collisions.

### What shade to pick
Other than the backgroud, each color has 6 shades to choose from. They are
`p10`, `p25`, `p50`, `p75`, `p100`, `p125` from darkest to brightest. The names
roughly corresponds to the percentage of brightness compared to the original
color.

`p125` should be avoided since there might not be a color brighter than the
original color.

Here is how to pick them in different scenarios:

#### Foreground color of text
Use `p100` by default.

Use `p75` for a darker shade, such as:
- less important things
- comments
- disabled

Use `p50` for even less important things that are ok not to be readable.

To highlight a text, try to use background highlight or border.
If not possible, use `p125` as last resort.

#### Background highlight
Use `p25` for things requiring some user attension.

Use `p10` for to indicate a difference from regular background but does not need
user attantion.

#### Border
Borders defined as UI elements that are much narrower than text height and
is only a few pixels wide.


Use `p50` by default.

Use `p75` for things requiring user attension. There should be only one UI
element with `p75` border in most cases.

Use `p25` for less important things, such as:
- character limit guide
- tree view vertical guide

#### Inverted

Inverted element is one with bright foreground and dark background.

Places where inverted should be used:
- buttons
- statusbar
- highlighting section of text where regular background highlight is not ideal.

Use `p75` as background by default. `p100` as brighter variant.

Use `background` as the text color.

#### Scroll bar

Scroll bar can be think of a special case for inverted element.

Use `p25` by default.

Use `p50` as brighter variant.

### How to deal with terminal apps

#### differentiate UI sections

Sometimes we need to differentiate UI sections,
but border is not possible/ideal. In that case, use either inverted element
or `p25` as background.

#### Limitted to ANSI 16

Use `ansi.*` only.

TODO support `primary`, `secondary`, and aboslute color aliases.

#### Limitted to ANSI 256

base9 does not support ANSI 256 and will not support it in the near future.


