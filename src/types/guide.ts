export type ID = string;

export type UserRole = "user" | "admin";

export type BlockType = "text" | "image";

export type GridLayout = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export type BaseBlock = {
    id: ID;
    type: BlockType;
    layout: GridLayout;
};

export type TextBlock = BaseBlock & {
    type: "text";
    content: string;
};

export type ImageBlock = BaseBlock & {
    type: "image";
    url: string;
};

export type Block = TextBlock | ImageBlock;

export type Section = {
    id: ID;
    title: string;
    blocks: Block[];
};

export type Page = {
    id: ID;
    title: string;
    sections: Section[];
};
