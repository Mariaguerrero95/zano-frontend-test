export type GridLayout = {
    x: number;
    y: number;
    w: number;
    h: number;
};
export type BaseBlock = {
    id: string;
    layout: GridLayout;
};
export type TextBlock = BaseBlock & {
    type: "text";
    content: string;
    imageUrl?: string; 
};
export type Block = TextBlock | ImageBlock;
export type Section = {
    id: string;
    title: string;
    blocks: Block[];
};
export type Page = {
    id: string;
    title: string;
    sections: Section[];
};
export type ImageBlock = BaseBlock & {
    type: "image";
    url: string;
};