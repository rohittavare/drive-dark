content_path = "url(" + chrome.runtime.getURL("assets/material_common_sprite905_gm3_grey_medium.svg") + ")"

USE_NEW_IMPLEMENTATION = true
DISABLE_ICONS = true

const DEFAULT_TEXT = '#c4c7c5'
const DARK_TEXT = '#484b4a'
const TITLE_TEXT = '#e3e3e3'
const LINK_TEXT = '#a8c7fa'
const INACTIVE_TEXT = '#505251'

const DEFAULT_SEPARATOR = '#444746'

const DEFAULT_BACKGROUND = '#1e1f20'
const DEFAULT_BACKGROUND_HOVER = '#2d2e2e'

const DARK_BACKGROUND = '#131314'
const DARK_BACKGROUND_HOVER = '#242424'

const LIGHT_BACKGROUND = '#37393b'
const LIGHT_BACKGROUND_HOVER = '#313132'

const DROPDOWN_MENU_BACKGROUND = ''
const DROPDOWN_MENU_BACKGROUND_HOVER = ''
const DROPDOWN_MENU_BACKGROUND_SELECTED = ''
const DROPDOWN_MENU_TEXT = ''
const DROPDOWN_MENU_TEXT_HOVER = ''
const DROPDOWN_MENU_TEXT_SELECTED = ''

const DEFAULT_BUTTON_BACKGROUND = '#004a77'
const DEFAULT_BUTTON_TEXT = '#c2e7ff'

const MINIMAL_BUTTON_BACKGROUND = 'transparent'
const MINIMAL_BUTTON_BACKGROUND_HOVER = 'rgb(168 199 250 / 10%)'
const MINIMAL_BUTTON_TEXT = '#a8c7fa'
const MINIMAL_BUTTON_BORDER = "#8e918f"

const HIGHLIGHT_BACKGROUND = '#004a77'
const HIGHLIGHT_TEXT = '#c2e7ff'

function get_content_path(asset) {
    return "url(" + chrome.runtime.getURL("assets/" + asset) + ")"
}

function modify_paths(paths, parents = undefined, modifiers = undefined, children = undefined) {
    let split_paths = paths.split(", ")
    if (parents != undefined) {
        let parents_list = parents.split(', ')
        let split_paths_temp = []
        for (const parent of parents_list) {
            for (const path of split_paths) {
                split_paths_temp.push(parent + " " + path)
            }
        }
        split_paths = split_paths_temp
    }
    if (modifiers != undefined) {
        let modifiers_list = modifiers.split(', ')
        let split_paths_temp = []
        for (const modifier of modifiers_list) {
            for (const path of split_paths) {
                split_paths_temp.push(path + "" + modifier)
            }
        }
        split_paths = split_paths_temp
    }
    if (children != undefined) {
        let children_list = children.split(', ')
        let split_paths_temp = []
        for (const child of children_list) {
            for (const path of split_paths) {
                split_paths_temp.push(path + " " + children)
            }
        }
        split_paths = split_paths_temp
    }
    return split_paths.join(', ')
}

class Template {
    constructor(parent = undefined, target = undefined) {
        this.parent = parent
        this.target = target
    }

    get template() {
        return {}
    }

    get config() {
        return Object.fromEntries(
            Object.entries(this.template).map(([k, v]) => {
                return [this.resolve(k, true), v]
        }))
    }

    resolve(temp, resolve_parent = false) {
        return temp.split(', ').map((tm) => {
            let targets = ['']
            if (this.target != undefined) {
                targets = this.target.split(', ')
            }
            let parents = ['']
            if (resolve_parent && this.parent != undefined) {
                parents = this.parent.split(', ')
            }
            let resolved = []
            for (const p of parents) {
                for (const t of targets) {
                    resolved.push(p + " " + tm.replaceAll("@", t))
                }
            }
            return resolved.join(', ')
        }).join(', ')
    }
}

class DarkDropdown extends Template {
    get template() {
        let cfg = {
            '@.goog-menu[class*="menu-vertical"], @.goog-menu[class*="menu-horizontal"], @.goog-menu, @[role*="listbox"], #t-formula-menu': {
                "background": DEFAULT_BACKGROUND,
                "border-radius": "15px",
                "border": "1px solid " + DEFAULT_SEPARATOR,
            },
            '@ .goog-palette-table, @ .waffle-data-validation-chips-footer': {
                "border-color": DEFAULT_SEPARATOR,
            },
            '@ .waffle-function-category-row, @ div[role="option"]': {
                "background": DEFAULT_BACKGROUND,
            },
            '@ .waffle-function-category-row:hover, @ div[role="option"]:hover': {
                "background": DEFAULT_BACKGROUND_HOVER,
                "border": "none",
            },
            '@.goog-menuitem .goog-menuitem-content, @.goog-menuitem': {
                "color": DEFAULT_TEXT,
            },
            '@.goog-menuitem[class*="disable"] .goog-menuitem-content, @.goog-menuitem[class*="disable"]': {
                "color": INACTIVE_TEXT,
            },
            '@.goog-menuitem.goog-menuitem-disabled @.goog-menuitem-content, @.goog-menuitem.goog-menuitem-disabled': {
                "color": DARK_TEXT,
            },
            '@ .goog-palette-cell': {
                "border-radius": "5px",
            },
            '@.goog-menuitem.goog-menuitem-highlight, @.ac-row.ac-active, @.ac-row.ac-active div, @ .goog-palette-cell-hover': {
                "background": DEFAULT_BACKGROUND_HOVER,
            },
            '@ .goog-palette-cell-selected': {
                "background": HIGHLIGHT_BACKGROUND
            },
            "@ .goog-palette-cell-selected .docs-icon-img": {
                "content": get_content_path("material_common_sprite909/blue.svg")
            },
            'div@[role=separator], div@[class*="separator"], div@[class=*="divider"]': {
                "border-color": DEFAULT_SEPARATOR,
            },
        }
        cfg = Object.assign(cfg, (new HtmlText(INACTIVE_TEXT, this.resolve('@.goog-menuitem[class*="disable"] .goog-menuitem-content, @.goog-menuitem[class*="disable"]'))).config)
        return cfg
    }
}

class HtmlText extends Template {
    constructor(color, parent = undefined, target = undefined) {
        super(parent, target)
        this.color = color
    }

    get template() {
        return {
            "span@, p@, div@": {
                "color": this.color,
            },
        }
    }
}

class BackgroundArea extends Template {
    constructor(background, parent=undefined, target=undefined) {
        super(parent, target)
        this.background = background
    }

    get template() {
        return {
            "@": {
                "background": this.background
            }
        }
    }
}

class TitleText extends HtmlText {
    constructor(parent = undefined, target = undefined) {
        super(TITLE_TEXT, parent, target)
    }
}

class DefaultText extends HtmlText {
    constructor(parent = undefined, target = undefined) {
        super(DEFAULT_TEXT, parent, target)
    }
}

class FlatButton extends Template {
    constructor(hover_color, use_before = false, parent = undefined, target = undefined, background_div = undefined) {
        super(parent, target)
        this.hover_color = hover_color
        // some buttons use the ::before property to set the background
        this.use_before = use_before
        // for buttons which use a specific child diff for the background
        this.background_div = background_div
    }

    get template() {
        let button_selectors = [
            'div@[role=button]',
            'a@[role=button]',
            'div@[role=tab]',
            'a@[role=tab]',
            'div@[class*="-button"]:not([class*="button-"]):not([class*="buttons"])',
            'a@[class*="-button"]:not([class*="button-"]):not([class*="buttons"])',
            'button@',
        ].join(", ")
        let svg_selectors = modify_paths(button_selectors, undefined, undefined, "svg")
        let button_hover_selectors = modify_paths(button_selectors, undefined, [
            ":hover",
            '[class*="hover"]'
        ].join(", "))
        let button_active_modifiers = [
            '[class*="checked"]',
            '[class*="active"]',
            '[class*="open"]',
            ':active',
            ':focus'
        ]
        let button_active_selectors = [
            modify_paths(button_selectors, undefined, [
                button_active_modifiers
            ].join(", ")),
            modify_paths(button_hover_selectors, undefined, [
                button_active_modifiers
            ].join(", ")),
        ].join(", ")
        let svg_active_selectors = modify_paths(button_active_selectors, undefined, undefined, "svg")
        let cfg = {
            [button_selectors]: {
                "background": "transparent",
                "color": DEFAULT_TEXT,
            },
            '@ .goog-flat-menu-button-dropdown': {
                "border-color": DEFAULT_TEXT + " transparent",
            },
            [svg_selectors]: {
                "fill": DEFAULT_TEXT,
            },
            [svg_active_selectors]: {
                "fill": HIGHLIGHT_TEXT,
            },
        }
        cfg = Object.assign(cfg, (new DefaultText(this.resolve(button_selectors))).config)
        cfg = Object.assign(cfg, (new HtmlText(HIGHLIGHT_TEXT, this.resolve(button_active_selectors))).config)

        let button_hover_background_selectors = button_hover_selectors
        let button_active_background_selectors = button_active_selectors
        if (this.use_before) {
            cfg = Object.assign(cfg, {
                [button_hover_background_selectors]: {
                    "background": "transparent",
                },
                [button_active_background_selectors]: {
                    "background": "transparent",
                },
            })
            button_hover_background_selectors = modify_paths(button_hover_background_selectors, undefined, "::before")
            button_active_background_selectors = modify_paths(button_active_background_selectors, undefined, "::before")
        } else if (this.background_div) {
            cfg = Object.assign(cfg, {
                [button_hover_background_selectors]: {
                    "background": "transparent",
                },
                [button_active_background_selectors]: {
                    "background": "transparent",
                },
            })
            button_hover_background_selectors = modify_paths(button_hover_background_selectors, undefined, undefined, this.background_div)
            button_active_background_selectors = modify_paths(button_active_background_selectors, undefined, undefined, this.background_div)
        }

        cfg = Object.assign(cfg, {
            [button_hover_background_selectors]: {
                "background": this.hover_color,
            },
            [button_active_background_selectors]: {
                "background": HIGHLIGHT_BACKGROUND,
            }
        })

        return cfg
    }
}

class FlatButtonDefaultBackground extends FlatButton {
    constructor(parent = undefined, target = undefined, use_before = false, background_div = undefined) {
        super(DEFAULT_BACKGROUND_HOVER, use_before, parent, target, background_div)
    }
}

class FlatButtonLightBackground extends FlatButton {
    constructor(parent = undefined, target = undefined, use_before = false, background_div = undefined) {
        super(LIGHT_BACKGROUND_HOVER, use_before, parent, target, background_div)
    }
}

class FlatButtonDarkBackground extends FlatButton {
    constructor(parent = undefined, target = undefined, use_before = false, background_div = undefined) {
        super(DARK_BACKGROUND_HOVER, use_before, parent, target, background_div)
    }
}

class BlueButton extends Template {
    get template() {
        let cfg = {
            'div@[role=button], div@[role=button], div@[role=button], button@': {
                "background": DEFAULT_BUTTON_BACKGROUND,
                "border-color": DEFAULT_BACKGROUND,
            },
            "@ .docs-icon-img": {
                "content": get_content_path("material_common_sprite909/blue.svg")
            },
            "@ .scb-icon": {
                "background-image": get_content_path("sprite_24/blue.svg")
            },
            '@ .goog-flat-menu-button-dropdown': {
                "border-color": DEFAULT_BUTTON_TEXT + " transparent"
            },
        }
        cfg = Object.assign(cfg, (new HtmlText(DEFAULT_BUTTON_TEXT, this.target)).config)
        cfg = Object.assign(cfg, (new HtmlText(DEFAULT_BUTTON_TEXT, undefined, this.target)).config)
        return cfg
    }
}

class DarkButton extends Template {
    get template() {
        let cfg = {
            'div@[role=button], div@[role=button], div@[role=button], button@': {
                "background": MINIMAL_BUTTON_BACKGROUND,
                "border": "1px solid " + MINIMAL_BUTTON_BORDER,
            },
            'div@[role=button][class*="hover"], div@[role=button][class*="focus"], div@[role=button]:hover, div@[role=button]:focus, button@:hover, button@:focus': {
                "background": MINIMAL_BUTTON_BACKGROUND_HOVER,
            },
            '@ .goog-flat-menu-button-dropdown': {
                "border-color": MINIMAL_BUTTON_TEXT + " transparent"
            },
        }
        cfg = Object.assign(cfg, (new HtmlText(MINIMAL_BUTTON_TEXT, this.resolve('div@[role=button], div@[role=button], div@[role=button], button@', false))).config)
        cfg = Object.assign(cfg, (new HtmlText(MINIMAL_BUTTON_TEXT, undefined, this.resolve('div@[role=button], div@[role=button], div@[role=button], button@', false))).config)
        return cfg
    }
}

class Input extends Template {
    constructor(background, parent = undefined, target = undefined) {
        super(parent, target)
        this.background = background
    }

    get template() {
        let cfg =  {
            "input@, form@[role=search], div@[role=search]": {
                "background": this.background,
                "color": DEFAULT_TEXT,
            },
            "input@ td, form@[role=search] td, div@[role=search] td": {
                "background": this.background,
                "color": DEFAULT_TEXT,
            },
            "input@ tr:hover, form@[role=search] tr:hover, div@[role=search] tr:hover": {
                "background": LIGHT_BACKGROUND_HOVER,
            },
            "input@ table, form@[role=search] table, div@[role=search] table": {
                "background": this.background,
                "color": DEFAULT_TEXT,
            },
        }
        cfg = Object.assign(cfg, (new DefaultText(this.resolve('input@, form@[role=search], div@[role=search]', false))).config)
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground(this.resolve('input@, form@[role=search], div@[role=search]', false), undefined, true)).config)
        return cfg
    }

}

class DefaultBackgroundArea extends Template {
    get template() {
        let cfg = {
            "@": {
                "background": DEFAULT_BACKGROUND,
            }
        }
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground(this.target)).config)
        cfg = Object.assign(cfg, (new Input('#282a2c', this.target)).config)
        return cfg
    }
}

class LightBackgroundArea extends Template {
    get template() {
        let cfg = {
            "@": {
                "background": LIGHT_BACKGROUND,
            }
        }
        cfg = Object.assign(cfg, (new FlatButtonLightBackground(this.target)).config)
        cfg = Object.assign(cfg, (new Input(DEFAULT_BACKGROUND, this.target)).config)
        return cfg
    }
}

class DarkBackgroundArea extends Template {
    get template() {
        let cfg = {
            "@": {
                "background": DARK_BACKGROUND,
            }
        }
        cfg = Object.assign(cfg, (new FlatButtonDarkBackground(this.target)).config)
        return cfg
    }
}

class Banner extends Template {
    constructor(target) {
        super(undefined, target)
    }

    get template() {
        let cfg = (new DefaultBackgroundArea(undefined, this.target)).config
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(this.target, ".docs-titlebar-buttons")).config)
        cfg = Object.assign(cfg, (new DarkButton(this.target + " .docs-titlebar-buttons", ".docs-material-button-flat-primary")).config)
        cfg = Object.assign(cfg, (new BlueButton(this.target + " #docs-titlebar-share-client-button")).config)
        return cfg
    }
}

class Sidebar extends Template {
    constructor(target = 'div[aria-roledescription*="sidebar"]') {
        super(undefined, target)
    }

    get template() {
        let cfg = {
            "@": {
                "border": "0px",
                "background": LIGHT_BACKGROUND,
            },
            "@ > div": {
                "border-color": DEFAULT_SEPARATOR,
                "background": "inherit",
            },
            "@ .docos-streampane-header": {
                "border-color": DEFAULT_SEPARATOR,
            }
        }

        cfg = Object.assign(cfg, (new LightBackgroundArea(undefined, this.resolve("@"))).config)
        cfg = Object.assign(cfg, (new LightBackgroundArea(this.resolve("@"), '.waffle-datavalidation-view-rule-list')).config)
        cfg = Object.assign(cfg, (new LightBackgroundArea(this.resolve("@"), '.docos-streampane-zero-state')).config)
        cfg = Object.assign(cfg, (new LightBackgroundArea(this.resolve("@"), '.docos-streampane-header')).config)
        cfg = Object.assign(cfg, (new DarkButton(this.resolve("@"), '.docos-streampane-zero-state-add-comment-button')).config)
        cfg = Object.assign(cfg, (new DarkButton(this.target, "docs-material-button")).config)
        cfg = Object.assign(cfg, (new LightBackgroundArea(this.target, '.docs-sidebar-tile-controls')).config)
        cfg = Object.assign(cfg, (new TitleText(this.resolve('@, @ div[class*="-header"]'), '[class*="-header"]')).config)
        return cfg
    }
}

class SheetsTabBar extends Template {
    get template() {
        let cfg = {
            "@ .docs-sheet-tab": {
                "border": "none",
            },
            "@ #grid-bottom-bar": {
                "border": "none",
            },
        }
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, this.resolve("@"))).config)
        return cfg
    }
}

class DefaultSettings {
    get config() {
        let cfg = {
            // default text settings
            "a": {
                "color": LINK_TEXT,
            },
            'span, p, div:not([class="waffle-dropdown-chip"])': {
                "color": DEFAULT_TEXT,
            },

            // default icon settings
            ".docs-icon-img": {
                "content": get_content_path("material_common_sprite909/gray.svg")
            },
            ".scb-icon": {
                "background_image": get_content_path("sprite_24/gray.svg")
            },
            'div[class*="checked"] .docs-icon-img': {
                "content": get_content_path("material_common_sprite909/blue.svg")
            },
            ".docs-homescreen-img": {
                "content": get_content_path("h_sprite63_grey_medium/gray.svg")
            },
            "svg": {
                "fill": DEFAULT_TEXT,
            },

            'div[role=separator], div[class*="separator"]': {
                "border-color": DEFAULT_SEPARATOR,
            },

            // default button settings
            'div[role=button][class*="hover"], div[role=button][class*="focus"], div[role=button]:hover, div[role=button]:focus': {
                "background": DEFAULT_BACKGROUND_HOVER,
            },
        }
        cfg = Object.assign(cfg, (new DarkDropdown()).config)

        // ===== docs home page =====
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, ".gb_Ha.gb_yb.gb_Bd.gb_Td.gb_Pd.gb_e.gb_1a.gb_dd")).config)
        
        // templates
        cfg = Object.assign(cfg, (new DarkBackgroundArea(undefined, ".docs-homescreen-fcc-content")).config)
        cfg = Object.assign(cfg, (new TitleText(undefined, ".docs-homescreen-templates-templateview-title")).config)
        
        // doc selection
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, ".docs-homescreen-templates-bar")).config)
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, ".docs-homescreen-item-container")).config)
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, ".docs-homescreen-floater-header")).config)
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground(".docs-homescreen-floater-header-buttons", undefined, true)).config)
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, ".docs-homescreen-item-container .docs-homescreen-grid-header")).config)
        
        // ===== docs edit page =====
        // cfg = Object.assign(cfg, (new Banner("#docs-chrome")).config)
        cfg = Object.assign(cfg, (new Banner("div[role=banner]")).config)
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, "#docs-titlebar .docs-title-input-wrapper .docs-title-input")).config)
        cfg = Object.assign(cfg, (new LightBackgroundArea(undefined, ".docs-main-toolbars")).config)
        cfg = Object.assign(cfg, (new LightBackgroundArea(undefined, ".docs-instant-bubble-container")).config)
        cfg = Object.assign(cfg, (new LightBackgroundArea(undefined, ".appsSketchyContentLibraryRailToolbar ")).config)
        cfg = Object.assign(cfg, (new Sidebar()).config)
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, ".kix-appview-editor")).config)
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, "#docs-editor-container")).config)
        // cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, ".left-sidebar-container-content")).config)
        // cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, ".docs-companion-app-switcher-container")).config)
        // cfg = Object.assign(cfg, (new FlatButtonDefaultBackground(undefined, ".app-switcher-button", true)).config)
        cfg = Object.assign(cfg, (new BlueButton(undefined, ".miniChapterSwitcherView")).config)
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, "#grid-bottom-bar")).config)
        
        cfg = Object.assign(cfg, (new SheetsTabBar()).config)
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground('.companion-collapser-button-container', ".app-switcher-button", false, '.app-switcher-button-icon-background')).config)
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground('.companion-app-switcher-container', ".app-switcher-button", false, '.app-switcher-button-icon-background')).config)

        return cfg
    }
}

CONFIG = {
    "content": {
        "<content>:assets/material_common_sprite908_gm3_grey_medium_01.svg": [
            'docs-grille-gm3|docs-material|docs-icon-img'
        ],
        "<content>:assets/material_common_sprite908_blue_01.svg": [
            'docs-grille-gm3:#docs-align-palette|goog-toolbar-button-checked|docs-icon-img',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-button-checked|docs-icon-img',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-button goog-toolbar-button-checked|docs-icon-img',
            'docs-grille-gm3 docs-gm|clean-palette|goog-palette-cell-selected|docs-icon-img',
            'docs-grille-gm3 docs-gm|trix-palette|goog-palette-cell-selected|docs-icon-img',
        ],
    },
    "background-color": {
        '#1e1f20': [ // secondary background color
            'kix-appview-editor-container|kix-appview-editor', // docs main background
        ],
        'rgba(19, 19, 20, 0.25)': [
            // docs edit bar buttons
            'docs-grille-gm3:#docs-align-palette|goog-toolbar-button goog-toolbar-button-hover',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-button goog-toolbar-button-hover',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-combo-button goog-toolbar-combo-button-hover',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-menu-button goog-toolbar-menu-button-hover',
            'docs-grille-gm3|trix-palette|goog-toolbar-menu-button goog-toolbar-menu-button-hover',
            'docs-grille-gm3:#docs-omnibox-toolbar.assisted-actions|docs-omnibox-input goog-omnibox-input-hover',
            //'docs-grille-gm3 docs-gm|docs-main-toolbars|goog-toolbar-menu-button-hover',
            'docs-grille-gm3.docs-gm:#docs-toolbar-mode-switcher goog-toolbar-menu-button-hover', // edit mode button
            // ================
            'building-blocks-category-tile docs-sidebar-tile|docs-sidebar-tile-header@hover',
            'building-block-card-content-container docs-gm3-button-hover',
            'docs-sidebar-gm-titlebar-icon-button docs-material docs-sidebar-gm-close-button docs-tiled-sidebar-close@hover',
            'appsSketchyContentLibraryRailToolbarButton-hover',
        ],
        'rgba(19, 19, 20, 0.5)': [
            'docs-grille-gm3.docs-gm:#docs-toolbar-mode-switcher goog-toolbar-menu-button-hover', // edit mode button
        ]
    },
    "background": {
        '#131314': [
            'docs-homescreen-empty-section-notice', // no videos yet banner
            'docs-homescreen-homescreenmain',
            'docs-homescreen-grid-header',
            'goog-menu goog-menu-vertical',
            'jfk-bubble docsshared-menu-bubble',
            'goog-inline-block goog-menu-button docs-homescreen-owner-filter-button',
            'docs-homescreen-itemholder-content docs-homescreen-floater-header',
            'docs-homescreen-item-container',
            'docs-homescreen-container docs-homescreen-docs',
            'docs-homescreen-list-header',
            'docs-homescreen-list-item',
            'ndfHFb-XuHpsb-gvZm2b-vJ7A6b ndfHFb-DaY83b-ppHlrf',
            'pGOlGd',
            'IzuY1c|ye3Lg',
            'docs-gm docsCommonWiz docs-material docs-grille-gm3 docs-homescreen-snackbar-enabled docs-homescreen-material-bar-enabled docs-homescreen-inline-new-blank-document-enabled', // google vids background
            'VIpgJd-TzA9Ye-eEGnhe ndfHFb-xl07Ob-LgbsSe ndfHFb-Bpn8Yb-OomVLb-xl07Ob-LgbsSe ndfHFb-Bz112c-LgbsSe ndfHFb-fmcmS-LgbsSe@focus', // file picker date sorter active
            'ndfHFb-xl07Ob-bN97Pc', // file picker date selector dropdown
            'overlay-container-ltr',
            //'grid-table-container fixed-table-container', // sheets h margin
            //'goog-inline-block grid4-inner-container@first-child', // sheets v margin
            'waffle-ac-renderer ac-datavalidation-renderer', // sheets cell dropdown menu
            'waffle-ac-renderer waffle-dropdown-chip-renderer', 
            'goog-menu gm3-menu gm3-menu-vertical docs-material',
        ],
        '#1e1f20': [ // secondary background color
            'gb_Ha gb_yb gb_Bd gb_Td gb_Pd gb_e gb_1a gb_9a', // mobile view header
            'gb_Kd gb_Nd gb_Zd', // tablet view header
            'docs-homescreen-fcc-flex docs-homescreen-fcc-flex-contracted', // movile view header
            'docs-homescreen-inline-new-blank-document-enabled|docs-homescreen-fcc-content', // google vids 
            'docs-homescreen-fcc-content',
            'gb_Ha gb_yb gb_Bd gb_Td gb_Pd gb_e gb_1a gb_dd',
            'docs-homescreen-grid-item-metadata-container',
            'docs-homescreen-templates-bar docs-homescreen-templates-bar-fullwidth',
            'docs-hs-tmp-contractedheader-more jfk-button',
            'docs-homescreen-fcc-flex-content-wrapper',
            'goog-menu goog-menu-vertical docs-homescreen-leftmenu',
            'qWuU9c',
            'gyDYrb',
            'fjSJOb XhFOdb pt4Wqc',
            'VfPpkd-AznF2e-LUERP-vJ7A6b VfPpkd-AznF2e-LUERP-vJ7A6b-OWXEXe-XuHpsb',
            'vd0D8c',
            //'XV0XSd|IzuY1c|eizQhe-ObfsIf-mJRMzd-V1ur5d-haAclf',
            'eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-mJRMzd fXxy9d-jXK9ad eizQhe-lJi4pf-PrY1nf', // file picker file
            'XV0XSd|IzuY1c|eizQhe-ObfsIf-jXK9ad fXxy9d-jXK9ad', // file picker file (shared)
            'fjSJOb XhFOdb',
            'XV0XSd|IzuY1c|eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-yEEHq',
            'BxNLed bwIXad', // file upload selection banner
            //'docs-homescreen-item-section',
            'VIpgJd-xl07Ob VIpgJd-xl07Ob-BvBYQ ndfHFb-xl07Ob fFW7wc-xl07Ob', // file picker date selector dropdown parent
            'kix-appview miniChapterSwitcherVisible', // chapter picker
            '#docs-chrome docs-material companion-enabled', // docs header
            '#docs-chrome:#docs-titlebar-container|docs-titlebar-buttons', // docs header button area
            'navigation-widget navigation-widget-unified-styling docs-material navigation-widget-floating-navigation-button navigation-location-indicator outline-refresh navigation-widget-hoverable navigation-widget-chaptered left-sidebar-container-content-child', // navigation bar
            'outlines-widget-chaptered|kix-outlines-widget-header-contents', // document tabs title background
            'eVDL2-WsjYwc xEuuXd', // share dialogue
            'docs-companion-app-switcher-container docs-material', // docs side picker
            'kix-appview-editor-container|kix-appview-editor:div', // docs main background
            'docs-grille-gm3.docs-gm:#docs-toolbar-mode-switcher', // edit mode button
            'docs-grille-gm3:#docs-omnibox-toolbar.assisted-actions|docs-omnibox-input', // docs help search bar
            'docs-omnibox-autocomplete|ac-renderer', // docs help search results
            'docs-grille-gm3|grid-bottom-bar', // slides bottom bar
            'docs-grille-gm3|docs-sheet-tab-open',
            '#docs-editor-container',
            'docs-grille-gm3|docs-sheet-tab',
            'punch-filmstrip-scroll', // slides preview scroll
            '#filmstrip-controls',
            '#speakernotes-container',
            '#speakernotes-dragger',
            '#workspace-container', // draw background
            'docs-grille-gm3:#t-formula-bar-input|cell-input', // formula bar
            '#t-formula-bar-input',
            '#t-formula-bar-label',
            'docs-grille-gm3|formula-bar-separator-container|formula-bar-separator',
            'docs-grille-gm3|formula-bar-with-name-box-wrapper',
            'waffle-name-box-container',
            '#t-name-box',
            '#t-name-box-dropdown',
            'waffle-sidebar-container|jfk-textinput',
            'waffle-range-selection-container',
            'waffle-conditionalformat-condition-type-select',
            'goog-inline-block goog-flat-menu-button jfk-select',
            'docs-material-button-hairline-primary docs-material-button',
            'waffle-datavalidation-edit-pill-advanced-options-title',
            'waffle-datavalidation-edit-pill-advanced-options-title@hover',
            'docos-streampane-search-input jfk-textinput',
        ],
        '#414443': [
            'goog-menuitem goog-option goog-menuitem-highlight', // docs dropdown menu item hover
            'VIpgJd-j7LFlb VIpgJd-j7LFlb-sn54Q', // file picker date selector dropdown hover
            'VIpgJd-j7LFlb VIpgJd-j7LFlb-sn54Q[aria-checked=true]', // file picker date selector dropdown hover
            'goog-menuitem apps-menuitem goog-menuitem-highlight', // docs dropdown hover
        ],
        '#0842a0': [
            'goog-menuitem goog-option-selected', // docs dropdown menu selected
            'VIpgJd-j7LFlb[aria-checked=true]', // file picker date switcher selected
        ],
        'rgb(168 199 250 / 10%)': [ // dark button hover
            'qhOH9d|VfPpkd-dgl2Hf-ppHlrf-sM5MNb|UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf UywwFc-StrnGf-yyd4I-VtOx3e UywwFc-kSE8rc-FoKg4d-sLO9V-YoZ4jf@hover', // file picker browse button hover
            '#titlebar-mode-indicator-container|docs-material-button-flat-primary docs-material-button titlebar-request-access-button@hover', // request access button
        ],
        'transparent': [
            'XV0XSd|IzuY1c|eizQhe-ObfsIf-mJRMzd-V1ur5d-haAclf',
            'VIpgJd-xl07Ob VIpgJd-xl07Ob-BvBYQ ndfHFb-xl07Ob fFW7wc-xl07Ob', // file picker date selector dropdown parent
            'qhOH9d|VfPpkd-dgl2Hf-ppHlrf-sM5MNb|UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf UywwFc-StrnGf-YYd4I-VtOx3e UywwFc-kSE8rc-FoKg4d-sLO9V-YoZ4jf', // file picker browse button
            'ndfHFb-jyrRxf-oKdM2c ndfHFb-DaY83b-ppHlrf eizQhe-lJi4pf-PrY1nf ndfHFb-jyrRxf-oKdM2c-NBtyUd@focus', // file picker my drive row focus
            'XV0XSd|IzuY1c|eizQhe-ObfsIf-jXK9ad fXxy9d-jXK9ad@focus', // file picker file (shared) focus
            '#titlebar-mode-indicator-container|docs-material-button-flat-primary docs-material-button titlebar-request-access-button', // request access button
        ],
        '#37393b': [
            'goog-inline-block jfk-button jfk-button-flat jfk-button-narrow docs-homescreen-fab',
            'oKubKe[aria-selected=true]',
            'avhARe|N5Br5',
            'XV0XSd|eizQhe-ObfsIf-mJRMzd-PFprWc', // file picker file large icon background
            'docs-grille-gm3.docs-gm|docs-material:#docs-toolbar-wrapper', // docs editor bar
            // docs edit bar buttons
            'docs-grille-gm3:#docs-align-palette|goog-toolbar-button',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-button',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-combo-button',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-menu-button',
            'docs-grille-gm3|trix-palette|goog-toolbar-menu-button',
            // ================
            'docs-gm|docs-tiled-sidebar.building-blocks-sidebar', // table properties side bar
            'building-blocks-category-tile docs-sidebar-tile|goog-zippy-expanded docs-sidebar-tile-header',
            'building-blocks-category-tile docs-sidebar-tile|docs-sidebar-tile-controls',
            'building-blocks-category-tile docs-sidebar-tile|docs-sidebar-tile-header',
            'building-blocks-category-tile docs-sidebar-tile|docs-sidebar-tile-header-cursor@focus@not( docs-sidebar-tile-header-no-focus)',
            'building-blocks-category-tile docs-sidebar-tile|goog-zippy-expanded.docs-sidebar-tile-header@focus',
            'waffleGriddySuggestionsBubbleRoot waffleGriddySuggestionsBubbleExpand', // convert to table dialogue
            'vQ43Ie', // gemini upgrade dialogue
            'appsSketchyContentLibraryRailToolbar appsSketchyContentLibraryRailGroup goog-toolbar', // slides side bar
            'punch-theme-sidebar docs-material', // slides theme picker
            'punch-theme-sidebar-header',
            'punch-theme-sidebar-in-presentation-header goog-zippy-header goog-zippy-collapsed',
            'punch-theme-sidebar-in-presentation-header goog-zippy-header goog-zippy-expanded',
            'punch-theme-sidebar-in-presentation-content docs-thumbnailcontainer',
            'waffle-sidebar-container waffle-datavalidation-sidebar docs-material waffle-gm-sidebar', // sheets cell validation sidebar
            'waffle-sidebar-title',
            'waffle-sidebar-content',
            'waffle-datavalidation-view-pill',
            'docs-gm|docos-comments-pe|docos-streampane-header',
            'docs-gm|docos-comments-pe|docs-docos-activity-sidebar-header',
            'docos-comments-pe|docos-streampane-all-filtered-out-state',
            'docos-comments-pe|docos-streampane-zero-state',
            'docos-comments-pe docs-docos-activity-sidebar',
        ],
        '#282a2c': [
            'gb_1a|gb_Fd',
            'gstl_50 gssb_c',
            'gssb_e ASO_PANEL',
            'gssb_m ASO_SUGGESTIONS_TABLE',
            'XV0XSd|IzuY1c|ZWZruf',
            'u3WVdc jBmls',
            //"ndfHFb-ObfsIf-jXK9ad-CNusmb-haDnnc-VtOx3e",
        ],
        '#242424': [ // hover on dark
            'docs-homescreen-list-item docs-homescreen-item-offline goog-control-hover', // docs list view hover
            'docs-homescreen-list-item docs-homescreen-item-shared goog-control-hover', // docs list view hover
            'VfPpkd-AznF2e VfPpkd-AznF2e-OWXEXe-jJNx8e-QBLLGd WbUJNb FEsNhd@hover',
            // 'goog-inline-block jfk-button jfk-button-flat jfk-button-narrow docs-homescreen-editorbar-actionbutton jfk-button-hover',
            'ndfHFb-jyrRxf-oKdM2c ndfHFb-DaY83b-ppHlrf eizQhe-lJi4pf-PrY1nf ndfHFb-jyrRxf-oKdM2c-NBtyUd@hover', // file picker my drive row hover
            'XV0XSd|IzuY1c|eizQhe-ObfsIf-jXK9ad fXxy9d-jXK9ad@hover', // file picker file (shared) hover
            'ndfHFb-jyrRxf-oKdM2c ndfHFb-DaY83b-ppHlrf ndfHFb-jyrRxf-oKdM2c-NBtyUd@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd)@hover', // file picker shared row hover
            'goog-inline-block jfk-button jfk-button-flat jfk-button-narrow docs-homescreen-editorbar-actionbutton jfk-button-hover@@before', // docs buttons hover
            'goog-inline-block goog-menu-button docs-homescreen-editorbar-actionbutton@@before', // docs az sort button hover
            'goog-menuitem colormenuitems-custom-header-add-button goog-menuitem-highlight', // hover on custom color picker
            'docs-customcolorpalette-add-custom-color-button@hover', // picker color hover
            'docs-customcolorpalette-eyedropper-button@hover', // eyedropper color hover
            'waffle-data-validation-auto-complete-row waffle-data-validation-auto-complete-row-active active', // sheets cell dropdown menu highlight
        ],
        '#2d2e2e': [ // hover on light
            'XV0XSd|IzuY1c|eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-yEEHq@hover', // file picker folder hover
            'eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-mJRMzd fXxy9d-jXK9ad eizQhe-lJi4pf-PrY1nf@hover', // file picker file hover
            'goog-menuitem docs-homescreen-leftmenu-menuitem goog-menuitem-highlight', // docs side navbar hover
            'docs-hs-tmp-contractedheader-overflow goog-inline-block goog-menu-button goog-menu-button-hover', // docs templates 3 dots hover
            'docs-homescreen-grid-item|docs-homescreen-item-overflow@hover', // docs file 3 dots hover
            'UTNHae J58z0d', // file picker grid/list view toggle button
            'VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc p9NqC Icoilb CZCFtc-c5RTEf qoCZef hp3b6d jbArdc VfPpkd-Bz112c-Jh9lGc@@before', // file picker close button hover
            'gb_1c@hover', // docs menu icon hover
            'gb_B@hover', // docs apps menu hover
            'gb_Oe gb_Pe@hover', // mobile view search hover
            'jfk-button-hover docs-homescreen-templates-bar-back', // templates view back button
            'navigation-widget-hat-close goog-flat-button-hover|navigation-widget-hat-close-button-outer-box', // navigation close button hover
            'docs-titlebar-badge goog-inline-block goog-control goog-control-hover', // docs top page icon buttons
            'docs-titlebar-badge goog-inline-block goog-flat-button goog-flat-button-hover', // docs top page icon buttons
            '#docs-save-indicator-badge goog-control goog-control-hover|docs-save-indicator-icon goog-inline-block', // docs top page save icon button
            '#docs-meet-in-editors-entrypointbutton goog-flat-menu-button goog-inline-block goog-flat-menu-button-hover', // docs google meet button
            'app-switcher-button-hover|app-switcher-button-icon-background', // side switcher close button hover
            'app-switcher-button-focused app-switcher-button-hover|app-switcher-button-icon-background', // side switcher close button hover
            'menu-button goog-control goog-inline-block goog-control-hover', // docs menu hover
            'menu-button goog-control goog-inline-block goog-control-hover goog-control-active', // docs menu click
            'menu-button goog-control goog-inline-block goog-control-open', // docs menu hover
            'docs-grille-gm3|docs-material:#docs-docos-commentsbutton jfk-button jfk-button-hover', // docs comment button
            '#docs-revisions-appbarbutton jfk-button-hover', // docs history button
            'docs-parent-collections-container goog-inline-block@hover', // docs title folder hover
            'docs-grille-gm3|docs-sheet-button-hover', // docs bottom bar hover
            'docs-grille-gm3|docs-sheet-tab-open@hover',
            'docs-grille-gm3|docs-sheet-tab docs-sheet-tab-hover',
            'docs-grille-gm3|waffle-name-box-container@hover:#t-name-box-dropdown name-box-dropdown',
            'docs-gm.docs-grille-gm3|docs-material|docs-chat.jfk-button',
            'docs-gm.docs-grille-gm3|docs-material|docs-chat.jfk-button-clear-outline',
            'docs-grille-gm3|docs-material|docs-presence-plus-widget-overflow-button',
            'docos-streampane-searchbar-close-button|docs-material-button-flat-default docs-material-button docs-material-button-hover',
        ],
        '#525252': [
            'app-switcher-button-focused|app-switcher-button-icon-background', // side switcher close button hover
        ],
        '#373737': [
            'gb_B[aria-expanded=true]', // docs apps menu focus
        ],
        '#414141': [
            'companion-collapser-button app-switcher-button-checked|app-switcher-button-icon-background',
            'companion-collapser-button app-switcher-button-checked app-switcher-button-hover|app-switcher-button-icon-background',
            'companion-collapser-button app-switcher-button-checked app-switcher-button-focused|app-switcher-button-icon-background',

        ],
        '#004a77': [
            'UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf UywwFc-StrnGf-YYd4I-VtOx3e UywwFc-kSE8rc-FoKg4d-sLO9V-YoZ4jf', // file picker banner open button
            'ndfHFb-ObfsIf-jXK9ad-haAclf ndfHFb-DaY83b-ppHlrf@focus|eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-mJRMzd fXxy9d-jXK9ad eizQhe-lJi4pf-PrY1nf', // file picker file focus
            'onv9We-AHmuwe-TSZdd|ndfHFb-ObfsIf-jXK9ad-haAclf@focus|eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-mJRMzd fXxy9d-jXK9ad', // file picker file (shared) focus
            'ndfHFb-ObfsIf-jXK9ad-haAclf ndfHFb-DaY83b-ppHlrf@focus|eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-yEEHq', // file picker folder focus
            'WkSZD', // file drop background
            'ndfHFb-jyrRxf-oKdM2c ndfHFb-DaY83b-ppHlrf eizQhe-lJi4pf-PrY1nf ndfHFb-jyrRxf-oKdM2c-NBtyUd ndfHFb-jyrRxf-oKdM2c-gk6SMd', // file picker my drive selected row
            'VIpgJd-TzA9Ye-eEGnhe VIpgJd-Kb3HCc-LgbsSe ndfHFb-Bz112c-LgbsSe ndfHFb-Bpn8Yb-OomVLb-mhHukc-LgbsSe', // file picker sort arrow background
            'chapter-item-label-and-buttons-container-selected', // document tab
            'chapter-item-label-and-buttons-container-selected@focus-within', // document tab
            'topLevelChapterContainerChaptered|chapter-container chapter-container-level-0|chapter-item|chapter-item-label-and-buttons-container-selected@hover', // document tab hover
            'miniChapterSwitcherContainerView.breadcrumbSwitcherUiVariant|miniChapterSwitcherNavigationEntryPointIcon', // open navigation button
            'miniChapterSwitcherContainerView.breadcrumbSwitcherUiVariant|miniChapterSwitcherNavigationEntryPointMask', // open navigation button
            'goog-inline-block docs-material-gm-select-outer-box', // open navigation button
            'miniChapterSwitcherCore|docs-material-gm-select|docs-material-gm-select-outer-box',
            'miniChapterSwitcherContainerView breadcrumbSwitcherUiVariant|miniChapterSwitcherCore|miniChapterSwitcherView docs-material-gm-select-hover|miniChapterSwitcherNavigationEntryPointMask',
            'miniChapterSwitcherContainerView breadcrumbSwitcherUiVariant|miniChapterSwitcherCore|miniChapterSwitcherView docs-material-gm-select-active|miniChapterSwitcherNavigationEntryPointMask',
            'miniChapterSwitcherContainerView breadcrumbSwitcherUiVariant|miniChapterSwitcherCore|miniChapterSwitcherView docs-material-gm-select-focused|miniChapterSwitcherNavigationEntryPointMask',
            '#docs-titlebar-share-client-button|goog-inline-block jfk-button jfk-button-action scb-split-button docs-titlebar-button', // share button
            '#docs-titlebar-share-client-button|docs-titlebar-button scb-quick-actions-menu-button goog-flat-menu-button goog-flat-menu-button-collapse-left goog-inline-block', // share dropdown button
            'building-block-card-insert-text',
            'docs-grille-gm3|docs-sheet-active-tab',
            'docs-grille-gm3|docs-sheet-tab-open@focus',
            'docs-grille-gm3|docs-sheet-active-tab docs-sheet-tab docs-sheet-tab-hover',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-button goog-toolbar-button-checked',
            'docs-grille-gm3 docs-gm:#docs-align-palette|goog-toolbar-button-checked',
            'docs-grille-gm3 docs-gm|clean-palette|goog-palette-cell-selected',
            'docs-grille-gm3 docs-gm|trix-palette|goog-palette-cell-selected',
            'docs-gm3-filled-button docs-gm3-button', // import theme button
            'docs-gm3-filled-button docs-gm3-button docs-gm3-button-hover', // import theme button
            'docos-comments-pe|docos-xeditor|docos-streampane-zero-state-add-comment-button docs-material-button',
            'docos-comments-pe|docos-xeditor|docos-streampane-zero-state-add-comment-button docs-material-button docs-material-button-hover',
            'docos-comments-pe|docos-filter-settings|docs-material-menu-button-flat-default.filter-applied',
            'docos-filter-reset-button docs-material-button',
            'docos-comments-pe|docos-filter-reset-button docs-material-button docs-material-button-hover',
            'docs-material-button-flat-default docs-material-button docos-filter-reset-button docs-material-button-hover',
        ],
        '#313132': [ // hover on extra light
            'docs-homescreen-list-item|docs-homescreen-item-overflow@hover', // docs list view file 3 dots hover
            'docs-sidebar-gm-titlebar-icon-button docs-material docs-sidebar-gm-close-button waffle-sidebar-title-close jfk-button-flat jfk-button jfk-button-hover',
            'waffle-datavalidation-view-pill@focus',
            'waffle-datavalidation-view-pill@hover',
            'docos-comments-pe|docs-material-button-flat-default docs-material-button docs-material-button-hover',
            'docs-sidebar-gm-titlebar-icon-button docs-material docs-sidebar-gm-close-button docs-docos-activity-sidebar-close goog-inline-block goog-flat-button goog-flat-button-hover',
            'docos-comments-pe|goog-inline-block docs-material-menu-button-flat-default docs-material-menu-button-flat-default-hover',
        ],
        '#26292d': [ // gray button hover
            //'UywwFc-LgbsSe@hover|UywwFc-vQzf8d', // file picker browse button text
            //'VfPpkd-dgl2Hf-ppHlrf-sM5MNb|UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf UywwFc-StrnGf-YYd4I-VtOx3e UywwFc-kSE8rc-FoKg4d-sLO9V-YoZ4jf@hover', // file picker browse button hover
        ],
        "#444746": [ // separator
            // docs naviation lines
            'outlines-widget|outlines-widget-chaptered|navigation-item-list goog-container|navigation-item-vertical-line-top',
            'outlines-widget|outlines-widget-chaptered|navigation-item-list goog-container|navigation-item-vertical-line-middle',
            'outlines-widget|outlines-widget-chaptered|navigation-item-list goog-container|navigation-item-vertical-line-bottom',
            'outlines-widget-chaptered|kix-outlines-widget-header-shadow',
            // ================
            'docs-grille-gm3|formula-bar-separator-container|formula-bar-separator>div'
        ],
    },
    "fill-opacity": {
        "1": [
            '#slides-view:#pages:>:svg:>:rect', // slides workspace
        ]
    },
    "fill": {
        '#e3e3e3': [
            //'VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc p9NqC qoCZef hp3b6d jbArdc:svg',
            //'I7ZCxe:svg',
            'Bz112c-OAU7Vd ndfHFb-vWsuo-haDnnc-At1hV-edvN0e', // file picker shared icon
            'VIpgJd-j7LFlb VIpgJd-j7LFlb-sn54Q[aria-checked=true]|ndfHFb-vWsuo-haDnnc-At1hV-edvN0e Bz112c-OAU7Vd', // file picker date selector dropdown hover
        ],
        '#c4c7c5': [
            'kZyufc:svg',
            'kXrPNd',
            'kXrPNd:g:path@first-child',
            'ndfHFb-vWsuo-haDnnc-At1hV-edvN0e:g:path@first-child', // file picker folder icons
            'VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc p9NqC qoCZef hp3b6d jbArdc:svg',
            'I7ZCxe:svg',
            'ndfHFb-vWsuo-haDnnc-At1hV-edvN0e', // file picker file path header separator
            'gb_Ha gb_1a:svg', // docs home icons
            'appsElementsSidekickEntryPointIcon materialdesignWizIconSvgsSvgIcon', // docs gemini logo
            'materialdesignWizIconSvgsSvgIcon',
            'docos-comments-pe|docs-gm.docos-xeditor|docos-search-button|docos-search-comments-icon-path',
            'docos-comments-pe|docos-filter-settings|docs-material-menu-button-flat-default-dropdown-icon',
            'docos-comments-pe|docos-filter-settings|goog-inline-block docs-material-menu-button-flat-default-hover|docs-material-menu-button-flat-default-dropdown-icon',
        ],
        '#c2e7ff': [ // selection text color
            'pGOlGd|ndfHFb-ObfsIf-Bpn8Yb-uDEFge-sM5MNb|ndfHFb-Bpn8Yb-OomVLb-mhHukc-LgbsSe:svg', // file picker sort arrow
            'eizQhe-jyrRxf-V1ur5d-haAclf|eizQhe-jyrRxf-TzA9Ye-Bz112c-gk6SMd:svg', // file picker row shared icon
            'ndfHFb-vWsuo-haDnnc-At1hV-edvN0e Bz112c-OAU7Vd', // file picker date switcher checkmark
        ],
        '#131314': [
            'javascriptMaterialdesignGm3WizIconButtonFilled-icon-button@hover|appsElementsSidekickEntryPointIcon materialdesignWizIconSvgsSvgIcon', // docs gemini logo
        ],
        '#1e1f20': [ // secondary background color
            'punch-filmstrip-thumbnails:>:rect', // slides filmstrip background
            '#slides-view:#pages:>:svg:>:rect', // slides workspace
        ],
    },
    "transition": {
        "fill .8s, transform .8s, color .8s": [
            'appsElementsSidekickEntryPointIcon materialdesignWizIconSvgsSvgIcon', // docs gemini logo
        ]
    },
    "color": {
        '#e3e3e3': [ // primary text color
            'goog-menuitem-content',
            'goog-menuitem',
            'docs-homescreen-grid-item-title',
            'docs-homescreen-owner-filter-label-text',
            'gb_Fd gb_Hd|gb_Be|gb_ze',
            'gb_1a|gb_Fd|gb_ze',
            'docs-hs-tmp-contractedheader-more jfk-button',
            'docs-homescreen-templates-templateview-title',
            'gssb_m',
            'docs-homescreen-list-item-title-value',
            'XV0XSd|IzuY1c A5Mhhd|fjSJOb:input Ax4B8',
            'eizQhe-mJRMzd-V1ur5d-fmcmS',
            'XV0XSd|pGOlGd|eizQhe-ObfsIf-mJRMzd|eizQhe-mJRMzd-V1ur5d-fmcmS',
            'eizQhe-jyrRxf-V1ur5d-r4nke> eizQhe-mJRMzd-V1ur5d-fmcmS',
            'VfPpkd-AznF2e VfPpkd-AznF2e-OWXEXe-jJNx8e-QBLLGd WbUJNb FEsNhd@hover',
            'VfPpkd-AznF2e VfPpkd-AznF2e-OWXEXe-jJNx8e-QBLLGd WbUJNb FEsNhd VfPpkd-AznF2e-OWXEXe-auswjd@focus:span', // file picker tab switcher hover text
            'WbUJNb@hover|VfPpkd-jY41G-V67aGc', // file picker tab switcher hover text
            'VIpgJd-j7LFlb VIpgJd-j7LFlb-sn54Q|VIpgJd-j7LFlb-bN97Pc', // file picker date selector dropdown hover text
            'goog-menuitem docs-homescreen-leftmenu-menuitem goog-menuitem-highlight|docs-homescreen-leftmenu-menuitem-text', // docs side navbar hover
            'goog-menuitem goog-option|goog-menuitem-content', // docs dropdown menu text
            'goog-menuitem goog-option goog-menuitem-highlight|goog-menuitem-content', // docs dropdown menu hover text
            'VIpgJd-TzA9Ye-eEGnhe ndfHFb-xl07Ob-LgbsSe-cHYyed', // file picker date sorter text
            'VIpgJd-j7LFlb-bN97Pc', // file picker date selector dropdown unselected text
            'VIpgJd-j7LFlb VIpgJd-j7LFlb-sn54Q[aria-checked=true]|ndfHFb-j7LFlb-V1ur5d', // file picker date selector dropdown hover
            'docs-title-input-label-inner', // doc title
            'mNL6p|d3Kuye|zv7tnb', // share dialogue title
            'docs-title-input@focus', // docs title input
            'docs-parent-collections-container-text',
            'docs-parent-collections-container-folder-name goog-inline-block', // docs title folder
            'docs-parent-collections-container goog-inline-block@hover|docs-parent-collections-container-folder-name goog-inline-block', // docs title folder hover
            'goog-menuitem apps-menuitem goog-menuitem-highlight', // docs dropdown hover
            'goog-menuitem apps-menuitem goog-menuitem-highlight|goog-menuitem-label', // docs dropdown hover
            '#docs-font-family|goog-toolbar-menu-button-caption goog-inline-block', // docs selected font
            '#docs-tiled-sidebar-title',
            'hXhhq',
            '#punch-theme-sidebar-title', // slides theme picker title
            'docs-grille-gm3:#t-formula-bar-input|cell-input', // formula bar
            '#t-name-box',
            'waffle-data-validation-auto-complete-row', // sheets cell dropdown menu font
            'waffle-sidebar-title',
            'waffle-datavalidation-view-pill-condition',
            'docos-comments-pe|docs-docos-activity-sidebar-header-title',
        ],
        '#c4c7c5': [ // secondary text color
            'docs-homescreen-empty-section-new-user-notice-heading', // 'no videos yet'
            'goog-menuitem goog-menuitem-disabled',
            'docs-homescreen-grid-item-time',
            'docs-homescreen-grid-item-sort-identifier',
            'docs-homescreen-floater-header-cell docs-homescreen-floater-header-title',
            'docs-homescreen-templates-bar docs-homescreen-templates-bar-fullwidth',
            'docs-homescreen-templates-templateview-brandauthor',
            'docs-homescreen-templates-templateview-brandlink',
            'docs-homescreen-templates-templateview-style',
            'docs-hs-tmp-contractedheader-text',
            'gb_Qd gb_qd',
            'goog-menuitem goog-menuitem-disabled',
            'docs-homescreen-leftmenu-material-menu-header-text',
            'docs-homescreen-leftmenu-menuitem-text',
            'gb_Ha gb_1a|gb_rd|gb_Qd',
            'ASO_SUGGESTIONS_CONTAINER',
            'docs-homescreen-floater-header-cell docs-homescreen-flex-auto docs-homescreen-floater-header-time',
            'docs-homescreen-list-header-cell docs-homescreen-list-header-title',
            'docs-homescreen-list-item-cell docs-homescreen-list-item-owner',
            'docs-homescreen-list-item-cell docs-homescreen-list-item-time',
            'gb_D|gb_B|gb_F',
            'VfPpkd-jY41G-V67aGc',
            'jfvobd',
            'WbUJNb|VfPpkd-jY41G-V67aGc', // file picker tab switcher text
            'iXlbzd JcDdO',
            'XV0XSd|pGOlGd|ndfHFb-rBfmuc-E2o6qc-V67aGc',
            'gtjro',
            'bSz6zd',
            'oZiBUc',
            'R9Lal',
            'saXBZ',
            'XV0XSd|IzuY1c|fjSJOb:input Ax4B8',
            'ZxXaId',
            'e0eYxe', // file select banner text
            'ndfHFb-jyrRxf-eEDwDf|ndfHFb-vWsuo-s4QLm-ibnC6b', // file picker my drive row text
            'eizQhe-euCgFf-MZArnb-V1ur5d', // file picker shared with me row owner text
            'YIW6H', // file path header text
            'menu-button goog-control goog-inline-block', // docs menu row text
            'goog-flat-menu-button-dropdown goog-inline-block', // google meet dropdown button
            'kix-outlines-widget-header-text-chaptered navigation-widget-header', // document tabs text
            // Docs Navigation tabs text
            'outlines-widget|outlines-widget-chaptered|chapter-container|location-indicator-highlight navigation-item goog-button-hover|navigation-item-level-0',
            'outlines-widget|outlines-widget-chaptered|chapter-container|navigation-item|navigation-item-level-0',
            'outlines-widget|outlines-widget-chaptered|chapter-container|navigation-item|navigation-item-level-1',
            'outlines-widget|outlines-widget-chaptered|chapter-container|navigation-item|navigation-item-level-2',
            'outlines-widget|outlines-widget-chaptered|chapter-container|navigation-item|navigation-item-level-3',
            'outlines-widget|outlines-widget-chaptered|chapter-container|navigation-item|navigation-item-level-4',
            'outlines-widget|outlines-widget-chaptered|chapter-container|navigation-item|navigation-item-level-5',
            'outlines-widget|outlines-widget-chaptered|chapter-container|navigation-item|navigation-item-level-6',
            'outlines-widget|outlines-widget-chaptered|chapter-container|navigation-item|navigation-item-level-7',
            // ==========
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-combo-button-input', // docs toolbar input text
            'docs-gm|docs-colormenuitems|docs-colormenuitems-custom-header',
            'docs-gm|docs-colormenuitems|docs-colormenuitems-scheme-header',
            'docs-grille-gm3:#docs-omnibox-toolbar.assisted-actions|docs-omnibox-input', // docs help search bar
            'docs-grille-gm3|docs-sheet-active-tab|docs-sheet-tab-name',
            'building-blocks-promo-header',
            'building-blocks-promo-subheader',
            'docs-sidebar-tile-header-text',
            'building-blocks-category-tile docs-sidebar-tile|docs-sidebar-tile-controls',
            'building-blocks-category-tile docs-sidebar-tile|docs-sidebar-tile-header',
            'docs-grille-gm3|docs-sheet-tab|docs-sheet-tab-name',
            'docs-grille-gm3|docs-sheet-tab docs-sheet-tab-hover|docs-sheet-tab-name',
            'docs-grille-gm3|docs-sheet-tab docs-sheet-tap-open docs-sheet-tab-hover|docs-sheet-tab-name',
            'javascriptMaterialdesignGm3WizButtonText-button__label waffleGriddySuggestionsBubbleSuggestionButtonLabel', // conver to table dialogue text
            'waffleGriddySuggestionsBubbleSuggestionButtonWrapper@hover|javascriptMaterialdesignGm3WizButtonText-button__label waffleGriddySuggestionsBubbleSuggestionButtonLabel', // conver to table dialogue text
            'e6yDCfi3',
            'goog-toolbar-button-inner-box goog-inline-block',
            'goog-toolbar-menu-button-caption goog-inline-block',
            'punch-theme-sidebar-in-presentation-header goog-zippy-header goog-zippy-collapsed',
            'punch-theme-sidebar-in-presentation-header goog-zippy-header goog-zippy-expanded',
            'punch-theme-sidebar|docs-thumbnailcontrol-title',
            'waffle-datavalidation-edit-pill-section-header',
            'waffle-sidebar-container|jfk-textinput',
            'waffle-range-selection-container',
            'goog-inline-block goog-flat-menu-button-caption',
            'waffle-range-selection-input',
            'docs-material-gm-labeled-checkbox|docs-material-gm-labeled-checkbox-label',
            'waffle-datavalidation-edit-pill-dropdown-render-type-buttons|jfk-radiobutton-label',
            'waffle-datavalidation-edit-pill-invalid-type-buttons|jfk-radiobutton-label',
            'docs-material-button-hairline-primary docs-material-button waffle-datavalidation-delete-all-button',
            'waffle-datavalidation-view-pill-range',
            'docos-streampane-tabbar|docs-tabbar-tab|docs-tabbar-tablabel',
            'docos-comments-pe|docos-streampane-zero-state-content-default-message',
            'docos-comments-pe|docos-streampane-zero-state-content-add-comment',
            'docos-comments-pe|docos-streampane-zero-state-footer-edu',
            'docos-comments-pe|docos-streampane-zero-state-footer-edu-explained',
            'docos-comments-pe.docs-docos-activity-sidebar|docos-filter-settings|docs-material-menu-button-flat-default-caption',
            'docos-streampane-search-input jfk-textinput',
        ],
        '#c2e7ff': [ // selection text color
            'V67aGc', // file picker banner open button text
            'ndfHFb-ObfsIf-jXK9ad-haAclf ndfHFb-DaY83b-ppHlrf@focus|eizQhe-mJRMzd-V1ur5d-fmcmS', // file picker file text focus
            'ndfHFb-ObfsIf-jXK9ad-haAclf ndfHFb-DaY83b-ppHlrf@focus|eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-yEEHq', // file picker folder focus
            'VfPpkd-AznF2e VfPpkd-AznF2e-OWXEXe-jJNx8e-QBLLGd WbUJNb FEsNhd VfPpkd-AznF2e-OWXEXe-auswjd@focus:span', // file picker tab switcher focus text
            'WbUJNb.VfPpkd-AznF2e-OWXEXe-auswjd|VfPpkd-jY41G-V67aGc', // file picker tab switcher active text
            'WbUJNb@hover.VfPpkd-AznF2e-OWXEXe-auswjd|VfPpkd-jY41G-V67aGc', // file picker tab switcher active hover text
            'ndfHFb-jyrRxf-oKdM2c-gk6SMd|eizQhe-jyrRxf-V1ur5d-r4nke> eizQhe-mJRMzd-V1ur5d-fmcmS', // file picker selected row title text
            'ndfHFb-jyrRxf-oKdM2c-gk6SMd|eizQhe-euCgFf-MZArnb-V1ur5d', // file picker shared with me selected row owner text
            'ndfHFb-jyrRxf-oKdM2c-gk6SMd|ndfHFb-jyrRxf-eEDwDf|ndfHFb-vWsuo-s4QLm-ibnC6b', // file picker my drive selected row text
            'goog-menuitem goog-option-selected|goog-menuitem-content', // docs dropdown menu selected text
            'ndfHFb-j7LFlb-V1ur5d', // file picker date selector dropdown selected text
            'chapter-item-label-and-buttons-container-selected|chapter-item .goog-control', // document tabs text
            'chapter-item-label-and-buttons-container-selected|chapter-label-content',
            'miniChapterSwitcherSelectedChapterInfoText', // docs navigation button text
            '#docs-titlebar-share-client-button|goog-inline-block jfk-button jfk-button-action scb-split-button docs-titlebar-button', // share button text
            'building-block-card-insert-text',
            'docs-grille-gm3|docs-sheet-active-tab|docs-sheet-tab-name',
            'docs-grille-gm3|docs-sheet-active-tab@focus|docs-sheet-tab-name',
            'docs-grille-gm3|docs-sheet-active-tab docs-sheet-tab docs-sheet-tab-hover|docs-sheet-tab-name',
            'docs-grille-gm3|docs-sheet-active-tab docs-sheet-tab|docs-sheet-tab-name',
            'docs-gm3-filled-button-label', // import theme button text
            'docos-comments-pe|docos-xeditor|docos-streampane-zero-state-add-comment-button.docs-material-button',
            'docos-comments-pe|docos-filter-settings|docs-material-menu-button-flat-default.filter-applied',
        ],
        '#a8c7fa': [ // pale blue
            'qhOH9d|UywwFc-vQzf8d', // file picker browse button text
            'qhOH9d|UywwFc-LgbsSe@hover|UywwFc-vQzf8d', // file picker browse button text
            'docs-grille-gm3:#titlebar-mode-indicator-container|docs-material-button-content', // request access button text
            'a@link',
        ]
    },
    "border-top": {
        "1px solid #444746": [
            '#formula-bar-container',
        ]
    },
    "border-top-color": {
        "#1e1f20": [
            'docs-homescreen-grid-item',
            'docs-homescreen-grid-item-metadata-container',
            'eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-mJRMzd fXxy9d-jXK9ad eizQhe-lJi4pf-PrY1nf',
            'docs-grille-gm3|grid-bottom-bar', // slides bottom bar
        ],
        '#444746': [
            'goog-menuseparator docs-homescreen-leftmenu-menuseparator',
            'gssb_e ASO_PANEL',
            'companion-app-switcher-separator', // docs side switcher separator
            "docs-gm|goog-menuseparator", // docs menu separator
            'punch-theme-sidebar-import-theme',
            'waffle-data-validation-chips-footer',
            'waffle-datavalidation-edit-pill-button-bar',
            'waffle-datavalidation-sidebar-button-bar',
        ],
        "transparent": [
            // file picker my drive selected row
            'eizQhe-TzA9Ye-VCkuzd-auswjd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'onv9We-AHmuwe-TSZdd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c-BP2Omd-AHmuwe ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'onv9We-AHmuwe-TSZdd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c@focus> ndfHFb-jyrRxf-eEDwDf> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'ndfHFb-k77Iif-DARUcf-QUIbkc|onv9We-AHmuwe-TSZdd|ndfHFb-jyrRxf-oKdM2c-BP2Omd-AHmuwe ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'ndfHFb-k77Iif-DARUcf-QUIbkc|onv9We-AHmuwe-TSZdd|ndfHFb-jyrRxf-oKdM2c@focus> ndfHFb-jyrRxf-eEDwDf> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            // ==========
        ],
    },
    "border-bottom-color": {
        "#1e1f20": ['docs-homescreen-grid-item', 'eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-mJRMzd fXxy9d-jXK9ad eizQhe-lJi4pf-PrY1nf'],
        "#444746": [
            'docs-homescreen-list-item',
            'VfPpkd-AznF2e-LUERP-bN97Pc',
            'ndfHFb-jyrRxf-eEDwDf',
            'ndfHFb-jyrRxf-haAclf|ndfHFb-rBfmuc-E2o6qc-tJHJj',
            'TNg8Ce',
            'XV0XSd|GtrNOb',
            'punch-theme-sidebar-in-presentation-header goog-zippy-header goog-zippy-expanded',
            'punch-theme-sidebar-in-presentation-header',
            'punch-theme-sidebar-header',
            'waffle-datavalidation-view-pill',
        //],
        //"transparent": [
            // file picker my drive selected row
            'eizQhe-YPIHXb-xl07Ob-auswjd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf',
            'onv9We-AHmuwe-TSZdd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c-BP2Omd-AHmuwe ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf',
            'onv9We-AHmuwe-TSZdd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c@focus> ndfHFb-jyrRxf-eEDwDf',
            'waffle-sidebar-title',
            'docos-comments-pe docs-docos-activity-sidebar|docos-streampane-header',
        ],
        "transparent": [
            'ndfHFb-k77Iif-DARUcf-QUIbkc|onv9We-AHmuwe-TSZdd|ndfHFb-jyrRxf-oKdM2c-BP2Omd-AHmuwe ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf',
            'ndfHFb-k77Iif-DARUcf-QUIbkc|onv9We-AHmuwe-TSZdd|ndfHFb-jyrRxf-oKdM2c@focus> ndfHFb-jyrRxf-eEDwDf',
            // ==========
        ],
    },
    "border-left-color": {
        "#1e1f20": ['docs-homescreen-grid-item', 'eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-mJRMzd fXxy9d-jXK9ad eizQhe-lJi4pf-PrY1nf'],
        "#444746": [
            'docs-hs-tmp-contractedheader-separator docs-hs-tmp-common-separator',
            'docs-grille-gm3|docs-main-toolbars|goog-toolbar-separator.goog-inline-block',
        ],
        "#1e1420": [
            '#docs-titlebar-share-client-button|docs-titlebar-button scb-quick-actions-menu-button goog-flat-menu-button goog-flat-menu-button-collapse-left goog-inline-block', // share dropdown button
        ],
        "transparent": [
            // file picker my drive selected row
            'eizQhe-TzA9Ye-VCkuzd-auswjd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf@first-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'onv9We-AHmuwe-TSZdd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c-BP2Omd-AHmuwe ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf@first-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'onv9We-AHmuwe-TSZdd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c@focus> ndfHFb-jyrRxf-eEDwDf@first-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'ndfHFb-k77Iif-DARUcf-QUIbkc|onv9We-AHmuwe-TSZdd|ndfHFb-jyrRxf-oKdM2c-BP2Omd-AHmuwe ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf@first-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'ndfHFb-k77Iif-DARUcf-QUIbkc|onv9We-AHmuwe-TSZdd|ndfHFb-jyrRxf-oKdM2c@focus> ndfHFb-jyrRxf-eEDwDf@first-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            // ==========
        ],
    },
    "border-right-color": {
        "#1e1f20": ['docs-homescreen-grid-item', 'eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-mJRMzd fXxy9d-jXK9ad eizQhe-lJi4pf-PrY1nf'],
        "transparent": [
            // file picker my drive selected row
            'eizQhe-TzA9Ye-VCkuzd-auswjd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf@last-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'eizQhe-YPIHXb-xl07Ob-auswjd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf@last-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'onv9We-AHmuwe-TSZdd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c-BP2Omd-AHmuwe ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf@last-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'onv9We-AHmuwe-TSZdd:@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd) ndfHFb-jyrRxf-oKdM2c@focus> ndfHFb-jyrRxf-eEDwDf@last-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'ndfHFb-k77Iif-DARUcf-QUIbkc|onv9We-AHmuwe-TSZdd|ndfHFb-jyrRxf-oKdM2c-BP2Omd-AHmuwe ndfHFb-jyrRxf-oKdM2c-BP2Omd-gSKZZ> ndfHFb-jyrRxf-eEDwDf@last-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            'ndfHFb-k77Iif-DARUcf-QUIbkc|onv9We-AHmuwe-TSZdd|ndfHFb-jyrRxf-oKdM2c@focus> ndfHFb-jyrRxf-eEDwDf@last-child> ndfHFb-jyrRxf-eEDwDf-hpYHOb-Q4BLdf',
            // ==========
        ]
    },
    "border-width": {
        '0px': ['ndfHFb-jyrRxf-haAclf|ndfHFb-XuHpsb-haAclf', 'eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-yEEHq']
    },
    "border-left-width": {},
    "border-top-width": {
        "1px": [
            //'#formula-bar-container',
        ]
    },
    "display": {
        "none": ['ndfHFb-jyrRxf-tJHJj']
    },
    "top": {
        "0px": [
            'ndfHFb-jyrRxf-haAclf ndfHFb-jyrRxf-SfQLQb-pk6n9',
        ]    
    },
    "border": {
        "0px": [
            "ndfHFb-ObfsIf-jXK9ad-CNusmb-haDnnc-VtOx3e", // file picker folder border
            'XV0XSd|IzuY1c|eizQhe-ObfsIf-jXK9ad fXxy9d-jXK9ad', // file picker file (shared)
            'ndfHFb-ObfsIf-jXK9ad-haAclf ndfHFb-DaY83b-ppHlrf@focus|eizQhe-ObfsIf-jXK9ad eizQhe-ObfsIf-yEEHq', // file picker folder focus
            'onv9We-AHmuwe-TSZdd|ndfHFb-ObfsIf-jXK9ad-haAclf@focus|eizQhe-ObfsIf-jXK9ad', // file picker file (shared) focus
        ],
        "1px solid #8e918f": [
            'UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf UywwFc-StrnGf-YYd4I-VtOx3e UywwFc-kSE8rc-FoKg4d-sLO9V-YoZ4jf', // file picker banner open button
            '#titlebar-mode-indicator-container|docs-material-button-flat-primary docs-material-button titlebar-request-access-button', // request access button
        ]
    },
    "border-color": {
        "#004a77": [ // selection color
            'rvBHac|VfPpkd-AznF2e-wEcVzc-OWXEXe-NowJzb', // file picker tab switcher selector bar
            'WbUJNb@hover|rvBHac|VfPpkd-AznF2e-wEcVzc-OWXEXe-NowJzb', // file picker tab switcher hover selector bar
            'WbUJNb@active|rvBHac|VfPpkd-AznF2e-wEcVzc-OWXEXe-NowJzb', // file picker tab switcher active selector bar
            'WbUJNb VfPpkd-AznF2e-OWXEXe-auswjd|rvBHac|VfPpkd-AznF2e-wEcVzc-OWXEXe-NowJzb', // file picker tab switcher active selector bar
        ],
        '#0842a0': [
            'docs-grille-gm3|docs-sheet-active-tab',
            'docs-grille-gm3|docs-sheet-tab-open@focus',
            'docs-grille-gm3|docs-sheet-active-tab docs-sheet-tab docs-sheet-tab-hover',
        ],
        "#1e1f20": [
            'docs-gm|docs-tiled-sidebar.building-blocks-sidebar', // table properties side bar
            'docs-grille-gm3|docs-sheet-tab',
        ],
        "#1e1f20 !important": [
            'docs-material-button-hairline-primary docs-material-button',
        ],
        "#444746": [
            'waffle-sidebar-container|jfk-textinput',
            'waffle-range-selection-container',
            'goog-inline-block goog-flat-menu-button docs-flatcolormenubutton',
            'waffle-conditionalformat-condition-type-select|goog-flat-menu-button',
        ],
        "#444746 !important": [
            'goog-inline-block goog-flat-menu-button jfk-select',
        ],
        '#c4c7c5': [
            'docs-material-gm-labeled-checkbox-checkbox docs-material-gm-labeled-checkbox-unchecked',
            'docos-comments-pe|docos-filter-settings|docs-material-menu-button-flat-default',
        ],
        '#2d2e2e': [ // hover on light
            'docs-grille-gm3|docs-sheet-tab docs-sheet-tab-hover',
        ],
    },
    "outline": {
        "none": [
            "pGOlGd|ndfHFb-jyrRxf-oKdM2c-BP2Omd-AHmuwe@not( ndfHFb-jyrRxf-oKdM2c-gk6SMd)"
        ],
    },
    "opacity": {
        "0": [
            'gb_B[aria-expanded=true]@@before',
            'gb_B@hover[aria-expanded=true]@@before',
            'VIpgJd-TzA9Ye-eEGnhe VIpgJd-Kb3HCc-LgbsSe ndfHFb-Bz112c-LgbsSe ndfHFb-Bpn8Yb-OomVLb-mhHukc-LgbsSe@@before', // file picker sort arrow background
        ],
        "1": [
            '#t-formula-bar-label',
        ]
    },
    "padding": {
        "3px": [
            'ndfHFb-ObfsIf-Bpn8Yb-uDEFge-sM5MNb|ndfHFb-Bpn8Yb-OomVLb-mhHukc-LgbsSe:svg', // file picker sort arrow background
        ]
    },
    "margin-top": {
        "4px": [
            'VIpgJd-TzA9Ye-eEGnhe VIpgJd-Kb3HCc-LgbsSe ndfHFb-Bz112c-LgbsSe ndfHFb-Bpn8Yb-OomVLb-mhHukc-LgbsSe', // file picker sort arrow background
        ]
    },
    //"height": {
    //    "0px": ['ndfHFb-jyrRxf-tJHJj', 'ndfHFb-jyrRxf-tJHJj-oKdM2c', 'ndfHFb-jyrRxf-tJHJj-r4nke']
    //},
    "height": {
        '24px': [
            'VIpgJd-TzA9Ye-eEGnhe VIpgJd-Kb3HCc-LgbsSe ndfHFb-Bz112c-LgbsSe ndfHFb-Bpn8Yb-OomVLb-mhHukc-LgbsSe', // file picker sort arrow background
        ]
    },
    "width": {
        '24px': [
            'VIpgJd-TzA9Ye-eEGnhe VIpgJd-Kb3HCc-LgbsSe ndfHFb-Bz112c-LgbsSe ndfHFb-Bpn8Yb-OomVLb-mhHukc-LgbsSe', // file picker sort arrow background
        ]
    },
    "z=index": {
        '2': [
        ]
    }
}

function generate_styles() {
    let defaults = new DefaultSettings()
    let resolved_style = ''
    for (const [selector, attrs] of Object.entries(defaults.config)) {
        let style = ''
        style += selector + ' {'
        for (const [attr, val] of Object.entries(attrs)) {
            if (attr != "content" || !DISABLE_ICONS) {
                style += '  ' + attr + ': ' + val + ' !important;\n'
            }
        }
        style += '}\n\n'
        resolved_style += style
    }
    return resolved_style
}

function transform() {
    let transformed = {}
    for (const [field, settings] of Object.entries(CONFIG)) {
        for (const [color, classes] of Object.entries(settings)) {
            for (const cls of classes) {
                clss =  cls.split(' ').join('.')
                clss = clss.replaceAll('|', ' .')
                clss = clss.replaceAll(':', ' ')
                clss = clss.replaceAll('@', ':')
                if (!clss.startsWith('#')) {
                    clss = '.' + clss
                }
                if (!(clss in transformed)) {
                    transformed[clss] = {}
                }
                if (color.startsWith('<content>')) {
                    // transformed[clss][field] = "url(" + chrome.runtime.getURL(color.split(':')[1]) + ")"
                } else {
                    transformed[clss][field] = color
                }
            }
        }
    }
    let s = ''
    for (const [clss, attrs] of Object.entries(transformed)) {
        s += clss + ' {'
        for (const [attr, val] of Object.entries(attrs)) {
            if (attr != "content" || !DISABLE_ICONS) {
                s += '  ' + attr + ': ' + val + ';\\n'
            }
        }
        s += '}\\n\\n'
    }

    l = document.createElement("style")
    if (!USE_NEW_IMPLEMENTATION) {
        l.innerText = s
    } else {
        l.innerText = generate_styles()
    }
    document.head.appendChild(l)
    
    if (document.getElementsByClassName('gb_2d gb_wb gb_Sd').length > 0) {
        new MutationObserver(dark_app_picker_callback).observe(document.getElementsByClassName('gb_2d gb_wb gb_Sd')[0], {
            'childList': true, 'subtree': true
        })
        new MutationObserver(dark_user_page_callback).observe(document.getElementsByClassName('gb_2d gb_wb gb_Sd')[0], {
            'childList': true, 'subtree': true
        })
    }
    new MutationObserver(dark_file_picker_callback(s)).observe(document.body, {
        'childList': true, 'subtree': true
    })
    es = document.getElementsByClassName('kix-appview-editor')
    if (es.length > 0) {
        let e = es[0]
        e.style = 'overflow-x: auto; height: 878px; cursor: auto;'
    }
    es = document.getElementsByClassName('docs-titlebar-buttons')
    if (es.length > 0) {
        let e = es[0]
        e.style = ''
    }
    es = document.getElementsByClassName('docs-material companion-enabled docs-toolbar-scrolled')
    if (es.length > 0) {
        let e = es[0]
        e.style = ''
    }
}

function dark_app_picker_callback(mutationList, observer) {
    for (const mutation of mutationList) {
        if (mutation.type == 'childList') {
            for (const node of mutation.addedNodes) {
                if (node.name == 'app') {
                    node.src = node.src+"&dm="
                    observer.disconnect()
                }
            }
        }
    }
}

function dark_user_page_callback(mutationList, observer) {
    for (const mutation of mutationList) {
        if (mutation.type == 'childList') {
            for (const node of mutation.addedNodes) {
                if (node.name == 'account') {
                    console.log(node.src)
                    console.log(node.contentWindow)
                    // node.addEventListener('load', (e) => {node.src = "https://ogs.google.com/u/0/widget/account?origin=https%3A%2F%2Fdocs.google.com&cn=account&dm="})
                    observer.disconnect()
                }
            }
        }
    }
}

function add_dark_file_picker_callback(style) {
    return (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type == 'childList') {
                console.log(mutation.addedNodes)
                for (const node of mutation.addedNodes) {
                    console.log(node.className)
                    if (node.className != undefined && node.className == 'google-picker modal-dialog') {
                        // console.log(node)
                        new MutationObserver(dark_file_picker_callback(style)).observe(node, {
                            'childList': true, 'subtree': true
                        })
                        observer.disconnect()
                        return
                    }
                }
            }
        }
    }
}

function dark_file_picker_callback(style) {
    return (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type == 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.tagName == 'IFRAME' && node.name != undefined && node.name.startsWith('I') && !(node.name.startsWith('I__'))) {
                        console.log(node)
                        node.addEventListener('load', (e) => {
                            n = document.getElementsByName(node.name)[0]
                            console.log(n)
                            s = n.contentWindow.document.createElement("style")
                            s.innerText = style
                            n.contentWindow.document.head.appendChild(s)
                        })
                    }
                }
            }
        }
    }
}

setTimeout(transform, 0);