export default {
    "mappings": [
        {"xxx.x": "background.o"},

        {"c0.o": "foreground.o"},
        {"c0.h": "foreground.o"},
        {"c0.s": "foreground.s"},
        {"c0.m": "foreground.ss"},
        {"c0.b": "background.ss"},

        // ansi
        {"ansi.black": "background.o"},
        {"ansi.red": "red.o"},
        {"ansi.green": "green.o"},
        {"ansi.yellow": "yellow.o"},
        {"ansi.blue": "blue.o"},
        {"ansi.magenta": "magenta.o"},
        {"ansi.cyan": "cyan.o"},
        {"ansi.white": "foreground.s"},
        {"ansi.bright_black": "background.ss"},
        {"ansi.bright_red": "red.h"},
        {"ansi.bright_green": "green.h"},
        {"ansi.bright_yellow": "yellow.h"},
        {"ansi.bright_blue": "blue.h"},
        {"ansi.bright_magenta": "magenta.h"},
        {"ansi.bright_cyan": "cyan.h"},
        {"ansi.bright_white": "foreground.o"},
        {"ansi.0": "ansi.black"},
        {"ansi.1": "ansi.red"},
        {"ansi.2": "ansi.green"},
        {"ansi.3": "ansi.yellow"},
        {"ansi.4": "ansi.blue"},
        {"ansi.5": "ansi.magenta"},
        {"ansi.6": "ansi.cyan"},
        {"ansi.7": "ansi.white"},
        {"ansi.8": "ansi.bright_black"},
        {"ansi.9": "ansi.bright_red"},
        {"ansi.a": "ansi.bright_green"},
        {"ansi.b": "ansi.bright_yellow"},
        {"ansi.c": "ansi.bright_blue"},
        {"ansi.d": "ansi.bright_magenta"},
        {"ansi.e": "ansi.bright_cyan"},
        {"ansi.f": "ansi.bright_white"},

        // by definition
        {"symbol": "c1"}, // highlight operator and special characters.
        {"tag": "c2"}, // TODO add description
        {"string": "c3"}, // commonly used
        {"function": "c4"},
        {"secondary": "c5"}, // need special attention, should be only for small portion of the ui.
        {"primary": "c6"}, // main color in ui
        {"keyword": "c7"},

        // aliases in absolute color
        {"error": "red"},
        {"good": "green"},
        {"warning": "yellow"},
        {"info": "blue"},
        {"link": "blue"},

        // used in UI
        {"ordinary": "secondary"},
        {"selection": "primary"}, // when user selects something
        {"comment.o": "foreground.s"},
        {"cursor.o": "foreground.o"},
        {"cursor.b": "background"},
        {"search.b": "background.ss"},
        {"link": "blue"}, // url or links in ui
        {"highlight": "secondary"}, // for ui hovering and other types of highlight
        {"match": "tag"},
        {"text_selection.b": "selection.m"},
        {"separator.o": "background.ss"},
        {"separator.h": "foreground.s"},
        {"scroll": "c0"},
        {"drag.b": "background.ss"}, // when user dragging a ui component
        {"line_number.o": "foreground.o"},
        {"line_number.s": "foreground.s"},
        {"line_number.m": "foreground.ss"},
        {"line_number.b": "background.ss"},
        {"quote": "secondary"}, // for displaying quotes in a document or ui context
        {"fold.b": "background.ss"},
        {"nontext.o": "foreground.o"},
        {"nontext.s": "foreground.s"},

        // not in UI, only in syntax highlighting
        {"static": "primary"},
        {"decorator": "function"},
        {"class": "primary"},
        {"literal": "function"},
        {"variable": "foreground"},
        {"variable_instance": "ordinary"},
        {"constant": "function"},

        // not yet used
        {"folder": "cyan"},
        {"debug": "error"}, // anything related to debugging
    ]
};