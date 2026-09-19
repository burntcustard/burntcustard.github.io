import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		excerpt: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const work = defineCollection({
	loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		site: z.string(),
		source: z.string().optional(),
		img: z.string().optional(),
		video: z.string().optional(),
		quote: z.string().optional(),
		quoteAuthor: z.string().optional(),
		quoteTitle: z.string().optional(),
		index: z.number().optional(),
	}),
});

export const collections = { blog, work };
