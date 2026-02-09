import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Page, PageCategory, PageMood, MoodLevel } from "../types/guide";
import { v4 as uuid } from "uuid";

type TourStep = {
    id: string;
    pageId: string;
    target: string;
    title: string;
    description: string;
    order: number;
};
/*** Fake in-memory database */
let pages: Page[] = [
    {
        id: "getting-started",
        title: "Getting Started",
        category: "getting-started",
        sections: [],
    },
    {
        id: "product-guides",
        title: "Practice Guides",
        category: "product-guides",
        sections: [],
    },
    {
        id: "faq",
        title: "FAQ",
        category: "faq",
        sections: [],
    },
];
let tourSteps = [
    {
        id: "tour-1",
        pageId: "getting-started",
        target: ".page-hero",
        title: "Welcome 🌿",
        description: "This is where your yoga journey begins.",
        order: 0,
    },
    {
        id: "tour-2",
        pageId: "getting-started",
        target: ".practice-path",
        title: "Your guided path",
        description: "Follow these steps at your own pace.",
        order: 1,
    },
    {
        id: "tour-3",
        pageId: "getting-started",
        target: ".card",
        title: "Practice content",
        description: "Each section contains practical guidance.",
        order: 2,
    },
];
let pageMoods: PageMood[] = [];

let uiSettings = {
    sidebarAudioEnabled: true,
};
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
type DeletePageArgs = {
    pageId: string;
};
type UpdatePageArgs = {
    pageId: string;
    title: string;
};
type UpdateTextBlockArgs = {
    pageId: string;
    sectionId: string;
    blockId: string;
    content: string;
    imageUrl?: string;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Pages", "UiSettings"],
    endpoints: (builder) => ({  
        /*** GET /pages */
        getPages: builder.query<Page[], void>({
        queryFn: async () => ({ data: pages }),
        providesTags: ["Pages"],
    }),
    /*** POST /pages */
    createPage: builder.mutation<Page, { title: string; category: PageCategory }>({
    queryFn: async ({ title, category }) => {
        const newPage: Page = {
        id: uuid(),
        title,
        category,
        sections: [],
        };
        pages = [...pages, newPage];
        return { data: newPage };
        },
    invalidatesTags: ["Pages"],
    }),
        /*** PATCH /pages/:pageId */
        updatePage: builder.mutation<void, UpdatePageArgs>({
        queryFn: async ({ pageId, title }) => {
            pages = pages.map((p) =>
            p.id === pageId ? { ...p, title } : p
            );
            return { data: undefined };
        },
        invalidatesTags: ["Pages"],
        }),
        /*** DELETE /pages/:pageId */
        deletePage: builder.mutation<void, DeletePageArgs>({
        queryFn: async ({ pageId }) => {
            pages = pages.filter((p) => p.id !== pageId);
            return { data: undefined };
        },
        invalidatesTags: ["Pages"],
        }),
        /*** SECTIONS */
        addSection: builder.mutation<AddSectionResponse, AddSectionArgs>({
        queryFn: async ({ pageId, title }) => {
            const newSection = { id: uuid(), title, blocks: [] };
            pages = pages.map((p) =>
            p.id === pageId
                ? { ...p, sections: [...p.sections, newSection] }
                : p
            );
            return { data: { pageId, sectionId: newSection.id } };
        },
        invalidatesTags: ["Pages"],
        }),
        updateSection: builder.mutation<void, UpdateSectionArgs>({
        queryFn: async ({ pageId, sectionId, title }) => {
            pages = pages.map((p) =>
            p.id === pageId
                ? {
                    ...p,
                    sections: p.sections.map((s) =>
                    s.id === sectionId ? { ...s, title } : s
                    ),
                }
                : p
            );
            return { data: undefined };
        },
        invalidatesTags: ["Pages"],
        }),
        deleteSection: builder.mutation<void, DeleteSectionArgs>({
        queryFn: async ({ pageId, sectionId }) => {
            pages = pages.map((p) =>
            p.id === pageId
                ? {
                    ...p,
                    sections: p.sections.filter(
                    (s) => s.id !== sectionId
                    ),
                }
                : p
            );
            return { data: undefined };
        },
        invalidatesTags: ["Pages"],
        }),
        /*** BLOCKS */
        addTextBlock: builder.mutation<void, AddTextBlockArgs>({
        queryFn: async ({ pageId, sectionId, content }) => {
            pages = pages.map((p) =>
            p.id === pageId
                ? {
                    ...p,
                    sections: p.sections.map((s) =>
                    s.id === sectionId
                        ? {
                            ...s,
                            blocks: [
                            ...s.blocks,
                            {
                                id: uuid(),
                                type: "text",
                                content,
                                layout: {
                                x: 0,
                                y: s.blocks.length * 2,
                                w: 6,
                                h: 3,
                                },
                            },
                            ],
                        }
                        : s
                    ),
                }
                : p
            );
            return { data: undefined };
        },
        invalidatesTags: ["Pages"],
        }),
        updateTextBlock: builder.mutation<void, UpdateTextBlockArgs>({
        queryFn: async ({
            pageId,
            sectionId,
            blockId,
            content,
            imageUrl,
        }) => {
            pages = pages.map((p) =>
            p.id === pageId
                ? {
                    ...p,
                    sections: p.sections.map((s) =>
                    s.id === sectionId
                        ? {
                            ...s,
                            blocks: s.blocks.map((b) =>
                            b.id === blockId
                                ? { ...b, content, imageUrl }
                                : b
                            ),
                        }
                        : s
                    ),
                }
                : p
            );
            return { data: undefined };
        },
        invalidatesTags: ["Pages"],
        }),
        updateBlockLayout: builder.mutation<void, UpdateBlockLayoutArgs>({
        queryFn: async ({ pageId, sectionId, blockId, layout }) => {
            pages = pages.map((p) =>
            p.id === pageId
                ? {
                    ...p,
                    sections: p.sections.map((s) =>
                    s.id === sectionId
                        ? {
                            ...s,
                            blocks: s.blocks.map((b) =>
                            b.id === blockId
                                ? { ...b, layout }
                                : b
                            ),
                        }
                        : s
                    ),
                }
                : p
            );
            return { data: undefined };
        },
        invalidatesTags: ["Pages"],
        }),
        /*** TOUR STEPS */
        getTourSteps: builder.query<TourStep[], { pageId: string }>({
            queryFn: async ({ pageId }) => ({
                data: tourSteps
                .filter((s) => s.pageId === pageId)
                .sort((a, b) => a.order - b.order),
            }),
            providesTags: ["Pages"],
        }),

    /*** PATCH /tour-steps */
    updateTourSteps: builder.mutation<void, { steps: TourStep[] }>({
        queryFn: async ({ steps }) => {
            tourSteps = steps;
            return { data: undefined };
        },
        invalidatesTags: ["Pages"],
    }),
    /*** PAGE MOOD */
    getPageMood: builder.query<PageMood | null, { pageId: string }>({
        queryFn: async ({ pageId }) => ({
        data: pageMoods.find((m) => m.pageId === pageId) ?? null,
        }),
        providesTags: ["Pages"],
    }),
    
    setPageMood: builder.mutation<void, { pageId: string; mood: MoodLevel }>({
        queryFn: async ({ pageId, mood }) => {
        pageMoods = pageMoods.filter((m) => m.pageId !== pageId);
        pageMoods.push({
            pageId,
            mood,
            createdAt: Date.now(),
        });
        return { data: undefined };
        },
        invalidatesTags: ["Pages"],
    }),
    /*** RELAX AUDIO */
    getUiSettings: builder.query<{ sidebarAudioEnabled: boolean }, void>({
        queryFn: async () => ({ data: uiSettings }),
        providesTags: ["UiSettings"],
        }),
        
        updateSidebarAudio: builder.mutation<void, { enabled: boolean }>({
            queryFn: async ({ enabled }) => {
                uiSettings = {
                    ...uiSettings,
                    sidebarAudioEnabled: enabled,
                };
            return { data: undefined };
            },
            invalidatesTags: ["UiSettings"],
        }),
    }),
});

/*** Hooks generated by RTK Query */
export const {
    useGetPagesQuery,
    useCreatePageMutation,
    useUpdatePageMutation,
    useDeletePageMutation,
    useAddSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
    useAddTextBlockMutation,
    useUpdateBlockLayoutMutation,
    useUpdateTextBlockMutation,
    useGetTourStepsQuery, 
    useUpdateTourStepsMutation,
    useGetPageMoodQuery,
    useSetPageMoodMutation,
    useGetUiSettingsQuery,
    useUpdateSidebarAudioMutation,
} = api;
