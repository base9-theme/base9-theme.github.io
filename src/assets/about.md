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

## How it's different from Base16

While is base16 is very successful, it is more or less stopped being maintained.

It also has a very fragmented community. Since every implementation of base16
is in it's own repository with its owner, it's very hard to make changes across
all of them.

Base9 aims to fix them while provide more improvements.

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

## How to implement base9 color theme for your favorite program

### Choose colors consistent with the rest of base9 ecosystem
In order to have consistent theme across different programs using base9,
Colors should have consistent use.

In this section we will assume it's a dark theme.
If it's a light theme, the reverse is true.

How each base color should be used is specified in the schema.

Other than the background, each of 8 colors has 6 shades from darkest to the brightest:
1. Signifies a slight difference from background.
Used mostly for elevating UI component, highlighting even/old lines.
Should not be used for highlighting for user attention.
2. Used as highlighted background for user attention.
3. Try not to use it as background or foreground. As it could make the contrast
too low. Can sometimes be used as borders in UI.
4. A darker shade of the normal color.
5. The original color.
6. Used as highlighting foreground. Try not to use it and use 2nd shade as
background when possible. Since depending on the color palette,
there might not be a color brighter than the original color.

## Designing color palette

Each color is used differently in the base9 system.
Although the use case might change slightly, here is the general run down:

1. Background. The darkest color ever possible in UI.
It will also be used to mix other color to create darker shades.
2. Normal foreground.
3. Used for symbols.
4. Used for tags, search matches.
5. Used for strings.
6. Used for function names, decorators, literals, constants.
7. Secondary in UI. Signifies special. Used for quotes, highlights
8. Primary color in UI. Signifies importance. Used for headings, buttons.
9. Used for keywords.

