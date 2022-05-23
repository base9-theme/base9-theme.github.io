export default {
    "c0": "foreground",
    "ansi": {
        "black": "background",
        "red": "red.p100",
        "green": "green.p100",
        "yellow": "yellow.p100",
        "blue": "blue.p100",
        "magenta": "magenta.p100",
        "cyan": "cyan.p100",
        "white": "foreground.p75",
        "bright_black": "foreground.p25",
        "bright_red": "red.p125",
        "bright_green": "green.p125",
        "bright_yellow": "yellow.p125",
        "bright_blue": "blue.p125",
        "bright_magenta": "magenta.p125",
        "bright_cyan": "cyan.p125",
        "bright_white": "foreground.p100",
        "0": "background",
        "1": "red.p100",
        "2": "green.p100",
        "3": "yellow.p100",
        "4": "blue.p100",
        "5": "magenta.p100",
        "6": "cyan.p100",
        "7": "foreground.p75",
        "8": "foreground.p25",
        "9": "red.p125",
        "a": "green.p125",
        "b": "yellow.p125",
        "c": "blue.p125",
        "d": "magenta.p125",
        "e": "cyan.p125",
        "f": "foreground.p100"
    },

    "symbol": "c1", // highlight operator and special characters.
    "tag": "c2", // TODO add description
    "string": "c3", // commonly used
    "function": "c4",
    "secondary": "c5", // need special attention, should be only for small portion of the ui.
    "primary": "c6", // main color in ui
    "keyword": "c7",
    // aliases in absolute color
    "error": "red",
    "good": "green",
    "warning": "yellow",
    "info": "blue",
    // used in UI
    "ordinary": "c5", // Same as secondary
    "selection": {
        "background": "c6.p25", // Same as primary, when user selects something
    },
    "comment": "foreground.p75",
    "cursor": {
        "background": "foreground.p100",
        "foreground": "background"
    },
    "search": {
        "background": "foreground.p25" //TODO ???
    },
    "link": "blue", // url or links in ui
    "highlight": "c5", // Same as Secondary, for ui hovering and other types of highlight
    "match": "tag",
    "text_selection": {
        "background": "c6.p50", //TODO
    },
    "separator": {
        "normal": "foreground.p25",
        "highlight": "foreground.p50"
    },
    "scroll": "foreground", //TODO
    "drag": { // when user dragging a ui component
        "background": "foreground.p25"
    },
    "line_number": { //TODO
        "current": "foreground.p75",
        "others": "foreground.p50"
    },
    // "line_number.o": "foreground.o",
    // "line_number.s": "foreground.s",
    // "line_number.m": "foreground.ss",
    // "line_number.b": "background.ss",
    "quote": "c5", // Same as secondary. for displaying quotes in a document or ui context
    "fold": {
        "background": "foreground.p10",
    },
    //TODO
    // "nontext.o": "foreground.o",
    // "nontext.s": "foreground.s",

    // not in UI, only in syntax highlighting
    "static": "c6",
    "decorator": "c4",
    "class": "c6",
    "literal": "c4",
    "variable": "foreground",
    "variable_instance": "c5",
    "constant": "foreground",
    // not yet used
    "folder": "cyan", //TODO
    "debug": "red" // anything related to debugging
}
