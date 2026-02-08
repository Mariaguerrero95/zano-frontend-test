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
export type PageCategory =
    | "getting-started"
    | "product-guides"
    | "faq";
    
export type Page = {
    id: string;
    title: string;
    category: PageCategory;
    sections: Section[];
};
export type ImageBlock = BaseBlock & {
    type: "image";
    url: string;
};
export type GuideTourStep = {
    id: string;
    pageId: string;
    target: string;
    title: string;
    description: string;
    order: number;
};


