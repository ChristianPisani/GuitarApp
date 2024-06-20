import { PortableTextBlock } from '@portabletext/types'
// import { Slug } from "@sanity/types";

export type Article = {
  title: string
  description: string
  content: PortableTextBlock
  slug: { current: string } //Slug
}
