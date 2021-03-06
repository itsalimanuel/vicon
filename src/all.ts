import Vue, { VNode, ComponentOptions, VueConstructor } from 'vue';
import * as IconMap from './map';
import { IIconInstance, IIconProps } from './run';


export type IconType = keyof typeof IconMap;

export interface IIconParkInstance extends IIconInstance {
    // FIXME just use string to prevent type error.
    type: IconType | string;
}

export interface IIconAllProps extends Vue, IIconProps {
    type: IconType
}

function toPascalCase(val: string): string {
    return val.replace(/(^\w|-\w)/g, c => c.slice(-1).toUpperCase());
}

const options: ComponentOptions<IIconParkInstance> = {
    name: 'icon-park',
    props: ['type', 'theme', 'size', 'spin', 'fill', 'strokeLinecap', 'strokeLinejoin', 'strokeWidth'],
    inheritAttrs: true,
    render(this: IIconParkInstance, h): VNode {

        const type = toPascalCase(this.type);
        const {
            theme,
            size,
            fill,
            strokeLinecap,
            strokeLinejoin,
            strokeWidth,
            spin
        } = this;

        if (!(type in IconMap)) {
            throw new Error(`${type} is not a valid icon type name`);
        }

        return h(IconMap[type as IconType], {
            props: {
                theme,
                size,
                fill,
                strokeLinecap,
                strokeLinejoin,
                strokeWidth,
                spin,
            },
        });
    },
};

export const IconPark: VueConstructor<IIconAllProps> = options as VueConstructor<IIconAllProps>;

export function install(Vue: VueConstructor, prefix?: string): void {
    Object.values(IconMap).forEach(icon => {
        Vue.component(prefix ? prefix + '-' + icon.name.slice(5) : icon.name, icon);
    });
}