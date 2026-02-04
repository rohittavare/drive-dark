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

class SheetsFunctionHelpDropdown extends Template {
    get template() {
        let cfg = {
            '@ #t-formula-menu, @[class*="waffle-unified-formula-help-wrapper"]': {
                "background": DEFAULT_BACKGROUND,
                "border-radius": "15px",
                "border": "1px solid " + DEFAULT_SEPARATOR,
            },
            '@ #waffle-formula-help': {
                "background": DEFAULT_BACKGROUND,
                "border-color": DEFAULT_SEPARATOR,
                "border-radius": '0 0 15px 15px',
            },
            '@ .waffle-arguments-help-body': {
                "background": DEFAULT_BACKGROUND,
                "border-color": DEFAULT_SEPARATOR,
            },
            '@ .waffle-unified-formula-help-argument-help-container': {
                "background": DEFAULT_BACKGROUND,
                "border-radius": "15px",
            },
            '@ .waffle-function-category-row': {
                "background": DEFAULT_BACKGROUND,
            },
            '@ .waffle-function-category-row:hover': {
                "background": DEFAULT_BACKGROUND_HOVER,
                "border": "none",
            },
        }
        return cfg
    }
}

class SheetsFormulaEditorBar extends Template {
    get template() {
        let cfg = {
            '#formula-bar-name-box-wrapper, #formula-bar-name-box-wrapper div, #formula-bar-name-box-wrapper input': {
                "background": DARK_BACKGROUND,
            },
            '#formula-bar-name-box-wrapper .formula-bar-separator div': {
                "background": DEFAULT_SEPARATOR,
            },
            '#formula-bar-name-box-wrapper span, #formula-bar-name-box-wrapper .cell-input': {
                "color": TITLE_TEXT,
            },
        }
        return cfg
    }
}

class DocumentTabsPanel extends Template {
    get template() {
        let cfg = {
        }
        cfg = Object.apply(cfg, (new DefaultBackgroundArea(undefined, '.navigation-widget-hat')).config)
        cfg = Object.apply(cfg, (new DefaultBackgroundArea(undefined, '.kix-outlines-widget-header-contents')).config)
        return cfg
    }
}

class DarkDropdown extends Template {
    get template() {
        let cfg = {
            '@.goog-menu[class*="menu-vertical"], @.goog-menu[class*="menu-horizontal"], @.goog-menu, :not([class*="function-autocomplete"]) > div@[role*="listbox"]': {
                "background": DEFAULT_BACKGROUND,
                "border-radius": "15px",
                "border": "1px solid " + DEFAULT_SEPARATOR,
            },
            '@ .goog-palette-table, @ .waffle-data-validation-chips-footer': {
                "border-color": DEFAULT_SEPARATOR,
            },
            '@ div[role="option"], @ div[role="menuitem"]': {
                "background": DEFAULT_BACKGROUND,
            },
            '@ div[role="option"]:hover, @ div[role="menuitem"]:hover': {
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

class LinkPreview extends Template {
    get template() {
        let cfg = {
            '#docs-link-bubble, div[role=dialog]': {
                "border-radius": "15px",
            },
            'address': {
                "color": DEFAULT_TEXT,
            },
            'div > div > img': {
                "border-color": DEFAULT_SEPARATOR,
            }
        }
        cfg = Object.assign(cfg, (new LightBackgroundArea(undefined, "#docs-link-bubble, div[role=dialog]")).config)
        return cfg
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
            'div@[role=checkbox]',
            'span@[role=checkbox]',
            'div@[role=button]:not([class*="formula-help-close-button"])',
            'a@[role=button]',
            'div@[role=tab]',
            'a@[role=tab]',
            'div@[class*="-button "]:not([class*="formula-help-close-button"]):not([role="link"])',//':not([class*="button-"]):not([class*="buttons"])',
            'a@[class*="-button "]:not([role="link"])',//':not([class*="button-"]):not([class*="buttons"])',
            'button@',
        ].join(", ")
        let button_selectors_wo_tabs = [
            'div@[role=button]:not([class*="formula-help-close-button"])',
            'a@[role=button]',
            'div@[class*="-button "]:not([class*="formula-help-close-button"])',//':not([class*="button-"]):not([class*="buttons"])',
            'a@[class*="-button "]',//':not([class*="button-"]):not([class*="buttons"])',
            'button@',
        ].join(", ")
        let svg_suffix = [
            'svg:not([class*="javascriptMaterialdesignGm3WizCircularProgressCircularProgressCircleGraphic"])',
            'svg:not([class*="javascriptMaterialdesignGm3WizCircularProgressCircularProgressCircleGraphic"]) > path:not([fill*="none"])',
        ].join(', ')
        let svg_selectors = modify_paths(button_selectors, undefined, undefined, svg_suffix)
        let button_hover_selectors = modify_paths(button_selectors, undefined, [
            ":hover",
            '[class*="hover"]'
        ].join(", "))
        let button_active_modifiers = [
            '[class*="checked"]',
            '[class*="selected"]',
            '[class*="active"]',
            '[class*="open"]',
            '[class*="filter-applied"]',
            ':active',
            ':focus'
        ].join(", ")
        let button_active_selectors = [
            modify_paths(button_selectors_wo_tabs, undefined, button_active_modifiers),
            modify_paths(button_selectors_wo_tabs, undefined, button_active_modifiers),
        ].join(", ")
        let svg_active_selectors = modify_paths(button_active_selectors, undefined, undefined, 'svg:not([class*="javascriptMaterialdesignGm3WizCircularProgressCircularProgressCircleGraphic"])')
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

        let button_background_selectors = button_selectors
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
            button_background_selectors = modify_paths(button_background_selectors, undefined, undefined, this.background_div)
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
            button_background_selectors = modify_paths(button_background_selectors, undefined, undefined, this.background_div)
            button_hover_background_selectors = modify_paths(button_hover_background_selectors, undefined, undefined, this.background_div)
            button_active_background_selectors = modify_paths(button_active_background_selectors, undefined, undefined, this.background_div)
        }

        cfg = Object.assign(cfg, {
            [button_background_selectors]: {
                "background": "transparent",
            },
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
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground(this.target, "#docs-save-indicator-badge", false, "#docs-save-indicator-id")).config)
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground(this.target, "#docs-star", false, "#docs-save-indicator-id")).config)
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

class Ruler extends Template {
    get template() {
        let cfg = {
            '#sketchy-vertical-ruler, #kix-horizontal-ruler, #kix-vertical-ruler, .docs-ruler-background, .docs-ruler-face, .sketchy-horizontal-ruler-container, #sketchy-horizontal-ruler': {
                "background": DEFAULT_BACKGROUND,
            },
            '.docs-ruler-face-major-division, #kix-horizontal-ruler, #kix-vertical-ruler, .docs-ruler-face-minor-division, #sketchy-vertical-ruler, #sketchy-horizontal-ruler, .docs-ruler-background-inner': {
                "border-color": DEFAULT_SEPARATOR,
            },
            '.docs-vertical-ruler-active-indicator': {
                "background": DEFAULT_SEPARATOR,
            },
            '#kix-vertical-ruler:before': {
                "background": "transparent",
            },
        }
        return cfg
    }
}

class DrawCanvasArea extends Template {
    get template() {
        let cfg = {
            '#workspace-container, #docs-editor': {
                "background": DEFAULT_BACKGROUND,
            },
            '#canvas.canvas': {
                "background-image": get_content_path("waffle.png"),
                "border-color": DEFAULT_SEPARATOR,
            },
        }
        return cfg
    }
}

class SlidesSpeakerNotes extends Template {
    get template() {
        let cfg = {
            '#speakernotes, #speakernotes-workspace': {
                "background": DARK_BACKGROUND,
                "color": DEFAULT_TEXT,
            },
            '#speakernotes-workspace > svg text': {
                "fill": DEFAULT_TEXT,
            },
        }
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, "#speakernotes-dragger, #speakernotes-dragger:hover")).config)
        return cfg
    }
}

class SlidesFilmstrip extends Template {
    get template() {
        let cfg = {
            '#filmstrip > div > svg text.punch-filmstrip-thumbnail-pagenumber': {
                'fill': DEFAULT_TEXT,
            },
            '#filmstrip, .punch-filmstrip-scroll': {
                'background': DARK_BACKGROUND,
            },
            '#filmstrip svg rect.punch-filmstrip-thumbnail-border-inner': {
                'stroke': DARK_BACKGROUND,
            },
            '.punch-filmstrip-controls-increase-size-button, .punch-filmstrip-controls-decrease-size-button, .punch-filmstrip-controls-reset-size-button': {
                'border-radius': '50%',
            },
        }
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, "#filmstrip-controls")).config)
        cfg = Object.assign(cfg, (new LightBackgroundArea(undefined, ".punch-filmstrip-controls-size-buttons")).config)
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground('#filmstrip-visibility-controls-container', undefined, false, '.punch-filmstrip-visibility-toggle-icon-container')).config)
        
        return cfg
    }
}

class DefaultSettings {
    get config() {
        let cfg = {
            // default text settings
            'a, div[role="link"], #docs-link-bubble a': {
                "color": LINK_TEXT,
            },
            '#waffle-name-box-open-sidebar-button.waffle-named-box-menu-open-sidebar-button': {
                "color": LINK_TEXT,
                "background": "transparent",
            },
            'span, p, div:not([class="waffle-dropdown-chip"]):not([role="link"])': {
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
            ':not(id=filmstrip) :not([id=workspace]):not([id=pages]) > svg:not([class*="javascriptMaterialdesignGm2WizCircularProgressCircularProgressCircleGraphic"])': {
                "fill": DEFAULT_TEXT,
            },

            'div[role=separator], div[class*="separator"]': {
                "border-color": DEFAULT_SEPARATOR,
            },

            'span[class*="instructions-border"]': {
                "border-color": DEFAULT_SEPARATOR,
            },
            "hr": {
                "background": DEFAULT_SEPARATOR,
            }
        }
        cfg = Object.assign(cfg, (new DarkDropdown()).config)
        cfg = Object.assign(cfg, (new SheetsFunctionHelpDropdown()).config)
        cfg = Object.assign(cfg, (new SheetsFormulaEditorBar()).config)

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
        cfg = Object.assign(cfg, (new LightBackgroundArea(undefined, '.annotation-attribution')).config)
        cfg = Object.assign(cfg, (new DefaultBackgroundArea(undefined, "div:has(.cell-input.editable), .cell-input.editable")).config)
        
        cfg = Object.assign(cfg, (new SheetsTabBar()).config)
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground('.companion-collapser-button-container', ".app-switcher-button", false, '.app-switcher-button-icon-background')).config)
        cfg = Object.assign(cfg, (new FlatButtonDefaultBackground('.companion-app-switcher-container', ".app-switcher-button", false, '.app-switcher-button-icon-background')).config)

        cfg = Object.assign(cfg, (new LightBackgroundArea(undefined, '.waffleGriddySuggestionsBubbleRoot')).config) // convert to table bubble
        cfg = Object.assign(cfg, (new LightBackgroundArea('#docs-editor-container', '.kix-documentmetrics-widget[aria-labelledby=kix-documentmetrics-widget-content]')).config) // word count bubble
        cfg = Object.assign(cfg, (new DrawCanvasArea()).config)
        cfg = Object.assign(cfg, (new Ruler()).config)
        cfg = Object.assign(cfg, (new LinkPreview()).config)
        cfg = Object.assign(cfg, (new SlidesSpeakerNotes()).config)
        cfg = Object.assign(cfg, (new SlidesFilmstrip()).config)

        return cfg
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
    // for (const [field, settings] of Object.entries(CONFIG)) {
    //     for (const [color, classes] of Object.entries(settings)) {
    //         for (const cls of classes) {
    //             clss =  cls.split(' ').join('.')
    //             clss = clss.replaceAll('|', ' .')
    //             clss = clss.replaceAll(':', ' ')
    //             clss = clss.replaceAll('@', ':')
    //             if (!clss.startsWith('#')) {
    //                 clss = '.' + clss
    //             }
    //             if (!(clss in transformed)) {
    //                 transformed[clss] = {}
    //             }
    //             if (color.startsWith('<content>')) {
    //                 // transformed[clss][field] = "url(" + chrome.runtime.getURL(color.split(':')[1]) + ")"
    //             } else {
    //                 transformed[clss][field] = color
    //             }
    //         }
    //     }
    // }
    let s = ''
    // for (const [clss, attrs] of Object.entries(transformed)) {
    //     s += clss + ' {'
    //     for (const [attr, val] of Object.entries(attrs)) {
    //         if (attr != "content" || !DISABLE_ICONS) {
    //             s += '  ' + attr + ': ' + val + ';\\n'
    //         }
    //     }
    //     s += '}\\n\\n'
    // }

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