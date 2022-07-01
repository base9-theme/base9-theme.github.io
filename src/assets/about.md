# Base9

An architecture for building themes based on a base of nine colors.
Base9 provides a website for designing the color palette and tools for applying
it to your favorite program. It is inspired by Base16.

## How to use the website.
* Pick your favorite color on the left.
* Preview the colors in preview tab on the top.
* Apply the colors to your favorite program in one of two ways.
    * Go to Export tab and select the program and copy/paste the settings.
    * Copy the 62 char long string on the left into your program's base9 setting.

## Overall Vision
Base9 wants to democratize color theme. It aims to let end users with little to no
programming or color science knowledge to customize its favorite apps.

Base9 aims to achieve it by having the user designing/specify only a few things
(as little as possible, only colors for now) and let Base9 figure out the rest
using color science and programming.

Base9 also aims to let user apply the designed theme to all programs easily.

Without sacrificing such simplicity, Base9 also tries to provide limited, optional finer
control for the theme generation for user who wants more control.

## How it's different from Base16

Base16 is very successful. But when I created base9, base16 was more or
less stopped being maintained.

It also had a very fragmented community. Since every implementation of base16
is in it's own repository with its owner, it's very hard to make changes across
all of them.

Base9 aims to fix them while provide more improvements.

Base16 has since been revitalized in [here](https://github.com/base16-project/base16)

It brings the base16 community together once again and aims to fix the issues it has.

The future of base9 is unclear, but for now it will continue to be developed.

Here is some of the improvements that base9 differs from base16 at the time of
writing (June 30 2022).

### Less but more choices
A base9 theme plugin for any program does not contain bloats for hundreds of
color combinations. Instead, it allows user to pick its own colors and apply
it to the programs.

### Less but more colors
Base16 has 16 colors but 8 of those are just different shades of black/white.
Base9 only requires 9 colors. But it uses color science to generate
different shades of colors, allowing more vivid UI.

### Relative vs Absolute
In UI, we sometimes need to the color red to display error, and green to display
happy case. I call it absolute color.
In other places we just want our favorite color to pop out and another favorite
color in other places. I call it relative color.
Base16 does not differentiate it, therefore if the button color is
the same as the error color, it will always be. If you don't like red being the
button color, you have made your error message non-red as well.

In base9, you only specify relative colors, and it will pick the most red color
as red and the most green color as green, and apply them in appropriate places.

### Better ANSI Color
Base16 does not differentiate bright vs normal ANSI color, while base9 supports
it via brighter shades of the colors.

Base16 also overrides the first 6 colors of ANSI 256, which could break other
programs that uses ANSI 256 color. When only ANSI 256 is supported, Base9 will
try its best to display the best color without overriding it. (This is not
implemented yet)

## Designing color palette

See [Color Palette Guide](/guide/color_palette)

## How to implement base9 color theme for your favorite program

See [Template Guide](/guide/template)

