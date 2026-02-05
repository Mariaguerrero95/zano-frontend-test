import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Page } from "../types/guide";
import { v4 as uuid } from "uuid";

/*** Fake in-memory database */
let pages: Page[] = [
    {
        id: uuid(),
        title: "Getting Started",
        sections: [],
    },
];

/*** Types */
type AddSectionResponse = {
    pageId: string;
    sectionId: string;
};
type AddSectionArgs = {
    pageId: string;
    title: string;
};
type UpdateSectionArgs = {
    pageId: string;
    sectionId: string;
    title: string;
};
type DeleteSectionArgs = {
    pageId: string;
    sectionId: string;
};
type AddTextBlockArgs = {
    pageId: string;
    sectionId: string;
    content: string;
};
type UpdateBlockLayoutArgs = {
    pageId: string;
    sectionId: string;
    blockId: string;
    layout: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Pages"],
    endpoints: (builder) => ({
        /*** GET /pages */
        getPages: builder.query<Page[], void>({
        queryFn: async () => {
            return { data: pages };
        },
        providesTags: ["Pages"],
    }),

    /*** POST /pages */
    createPage: builder.mutation<Page, { title: string }>({
        queryFn: async ({ title }) => {
            const newPage: Page = {
            id: uuid(),
            title,
            sections: [],
        };

        pages = [...pages, newPage];

        return { data: newPage };
    },
    invalidatesTags: ["Pages"],
    }),

    /*** POST /pages/:pageId/sections */
    addSection: builder.mutation<AddSectionResponse, AddSectionArgs>({
        queryFn: async ({ pageId, title }) => {
        const newSection = {
            id: uuid(),
            title,
            blocks: [],
        };

        pages = pages.map((page) =>
            page.id === pageId
            ? {
                ...page,
                sections: [...page.sections, newSection],
            }
            : page
        );

        return {
            data: {
            pageId,
            sectionId: newSection.id,
        },
        };
    },
    invalidatesTags: ["Pages"],
    }),

    /*** PATCH /pages/:pageId/sections/:sectionId */
    updateSection: builder.mutation<void, UpdateSectionArgs>({
        queryFn: async ({ pageId, sectionId, title }) => {
        pages = pages.map((page) =>
            page.id === pageId
            ? {
                ...page,
                sections: page.sections.map((section) =>
                    section.id === sectionId
                    ? { ...section, title }
                    : section
                ),
            }
            : page
        );

        return { data: undefined };
    },
        invalidatesTags: ["Pages"],
    }),

    /*** PATCH /pages/:pageId/sections/:sectionId/blocks/:blockId/layout */
    updateBlockLayout: builder.mutation<void, UpdateBlockLayoutArgs>({
        queryFn: async ({ pageId, sectionId, blockId, layout }) => {
        pages = pages.map((page) =>
            page.id === pageId
            ? {
                ...page,
                sections: page.sections.map((section) =>
                    section.id === sectionId
                    ? {
                        ...section,
                        blocks: section.blocks.map((block) =>
                            block.id === blockId
                            ? { ...block, layout }
                            : block
                        ),
                        }
                    : section
                ),
                }
            : page
        );
    
        return { data: undefined };
        },
        invalidatesTags: ["Pages"],
    }),
    

    /*** DELETE /pages/:pageId/sections/:sectionId */
deleteSection: builder.mutation<void, DeleteSectionArgs>({
    queryFn: async ({ pageId, sectionId }) => {
        pages = pages.map((page) =>
            page.id === pageId
            ? {
                ...page,
                sections: page.sections.filter(
                    (section) => section.id !== sectionId
                ),
                }
            : page
        );
    
        return { data: undefined };
        },
        invalidatesTags: ["Pages"],
    }),
    /*** POST /pages/:pageId/sections/:sectionId/blocks/text */
addTextBlock: builder.mutation<void, AddTextBlockArgs>({
    queryFn: async ({ pageId, sectionId, content }) => {
        pages = pages.map((page) =>
            page.id === pageId
            ? {
                ...page,
                sections: page.sections.map((section) =>
                    section.id === sectionId
                    ? {
                        ...section,
                        blocks: [
                            ...section.blocks,
                            {
                            id: uuid(),
                            type: "text",
                            content,
                            layout: {
                                x: Math.floor(Math.random() * 6),
                                y: 0,
                                w: 3,
                                h: 2,
                                },
                            },
                        ],
                        }
                    : section
                ),
                }
            : page
        );
    
        return { data: undefined };
    },
    invalidatesTags: ["Pages"],
    }),
}),
});

/*** Hooks generated by RTK Query */
export const {
    useGetPagesQuery,
    useCreatePageMutation,
    useAddSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
    useAddTextBlockMutation,
    useUpdateBlockLayoutMutation,
} = api;

