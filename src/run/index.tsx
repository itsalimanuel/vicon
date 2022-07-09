// @ts-ignore
import Vue, { ComponentOptions, CreateElement, VNode, VueConstructor } from 'vue';
// @ts-ignore
import { ArrayPropsDefinition, DefaultComputed, DefaultData, DefaultMethods } from 'vue/types/options';

export type StrokeLinejoin = 'miter' | 'round' | 'bevel';

export type StrokeLinecap = 'butt' | 'round' | 'square';

export type Theme = 'outline' | 'filled' | 'two-tone' | 'multi-color';

export interface ISvgIconProps {

    // Id
    id: string;

    // Icon size, default 1em
    size: number | string;

    // stroke width
    strokeWidth: number;

    // stroke endpoint type
    strokeLinecap: StrokeLinecap;

    // Stroke connector type
    strokeLinejoin: StrokeLinejoin;

    // skinnable color array
    colors: string[];
}

export interface IIconConfig {

    // Icon size, default 1em
    size: number | string;

    // stroke width
    strokeWidth: number;

    // stroke endpoint type
    strokeLinecap: StrokeLinecap;

    // Stroke connector type
    strokeLinejoin: StrokeLinejoin;

    // CSS prefix
    prefix: string;

    // Whether RTL is enabled
    rtl: boolean;

    // Default theme
    theme: Theme;

    // Theme default color
    colors: {

        outline: {
            fill: string;
            background: string;
        };

        filled: {
            fill: string;
            background: string;
        };

        twoTone: {
            fill: string;
            twoTone: string;
        };

        multiColor: {
            outStrokeColor: string;
            outFillColor: string;
            innerStrokeColor: string;
            innerFillColor: string;
        };
    };
}

// Icon Basic Properties
export interface IIconBase {

    // Icon size, default 1em
    size?: number | string;

    // stroke width
    strokeWidth?: number;

    // stroke endpoint type
    strokeLinecap?: StrokeLinecap;

    // Stroke connector type
    strokeLinejoin?: StrokeLinejoin;

    // Default theme
    theme?: Theme;

    // fill color
    fill?: string | string[];
}

// Wrapped Icon Properties
export interface IIconProps extends IIconBase {
    spin?: boolean;
}

// Rendering Help function properties
export type IconHelper = CreateElement;


// Example of the icon before wrapping
// @ts-ignore

export interface IIconInstance extends Vue, IIconProps {
    id: string;
    ICON_CONFIGS?: IIconConfig;
}

// Wrapped Icon Properties
// eslint-disable-next-line max-len
export type IconOptions = ComponentOptions<IIconInstance, DefaultData<{ id: string }>, DefaultMethods<never>, DefaultComputed, ArrayPropsDefinition<IIconProps>, IIconProps>;

// Icon renderer before wrapping
export type IconRender = (h: IconHelper, props: ISvgIconProps) => VNode;

// icon after wrapping
export type Icon = VueConstructor<IIconInstance>;

// default properties
export const DEFAULT_ICON_CONFIGS: IIconConfig = {
    size: '1em',
    strokeWidth: 4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    rtl: false,
    theme: 'outline',
    colors: {
        outline: {
            fill: '#333',
            background: 'transparent'
        },
        filled: {
            fill: '#333',
            background: '#FFF'
        },
        twoTone: {
            fill: '#333',
            twoTone: '#2F88FF'
        },
        multiColor: {
            outStrokeColor: '#333',
            outFillColor: '#2F88FF',
            innerStrokeColor: '#FFF',
            innerFillColor: '#43CCF8'
        }
    },
    prefix: 'i'
};

function guid(): string {
    return 'icon-' + (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
}

// attribute conversion function
export function IconConverter(id: string, icon: IIconBase, config: IIconConfig): ISvgIconProps {

    const fill = typeof icon.fill === 'string' ? [icon.fill] : icon.fill || [];
    const colors: string[] = [];

    const theme: Theme = icon.theme || config.theme;

    switch (theme) {
        case 'outline':
            colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
            colors.push('none');
            colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
            colors.push('none');
            break;
        case 'filled':
            colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
            colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
            colors.push('#FFF');
            colors.push('#FFF');
            break;
        case 'two-tone':
            colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
            colors.push(typeof fill[1] === 'string' ? fill[1] : config.colors.twoTone.twoTone);
            colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
            colors.push(typeof fill[1] === 'string' ? fill[1] : config.colors.twoTone.twoTone);
            break;
        case 'multi-color':
            colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
            colors.push(typeof fill[1] === 'string' ? fill[1] : config.colors.multiColor.outFillColor);
            colors.push(typeof fill[2] === 'string' ? fill[2] : config.colors.multiColor.innerStrokeColor);
            colors.push(typeof fill[3] === 'string' ? fill[3] : config.colors.multiColor.innerFillColor);
            break;
    }

    return {
        size: icon.size || config.size,
        strokeWidth: icon.strokeWidth || config.strokeWidth,
        strokeLinecap: icon.strokeLinecap || config.strokeLinecap,
        strokeLinejoin: icon.strokeLinejoin || config.strokeLinejoin,
        colors,
        id
    };
}

// Icon Wrapper
export function IconWrapper(name: string, rtl: boolean, render: IconRender): Icon {

    const options: IconOptions = {
        name: 'icon-' + name,
        inject: {
            ICON_CONFIGS: { default: DEFAULT_ICON_CONFIGS }
        },
        props: ['size', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'theme', 'fill', 'spin'],
        data() {
            return { id: guid() };
        },
        inheritAttrs: false,
        render(this: IIconInstance, h: CreateElement): VNode {

            const {
                size,
                strokeWidth,
                strokeLinecap,
                strokeLinejoin,
                theme,
                fill,
                id,
                spin,
                ICON_CONFIGS = DEFAULT_ICON_CONFIGS
            } = this;

            const svgProps = IconConverter(id, {
                size,
                strokeWidth,
                strokeLinecap,
                strokeLinejoin,
                theme,
                fill
            }, ICON_CONFIGS);

            const cls: string[] = [ICON_CONFIGS.prefix + '-icon'];

            cls.push(ICON_CONFIGS.prefix + '-icon' + '-' + name);

            if (rtl && ICON_CONFIGS.rtl) {
                cls.push(ICON_CONFIGS.prefix + '-icon-rtl');
            }

            if (spin) {
                cls.push(ICON_CONFIGS.prefix + '-icon-spin');
            }


            return h('span', {
                class: cls.join(' '),
                // @ts-ignore
                on: this.$listeners,
                // @ts-ignore
                attrs: this.$attrs
            }, [render(h, svgProps)]);
        }
    };

    return options as Icon;
}