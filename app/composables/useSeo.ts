import type { ISeo } from '~/interfaces/ISeo'

export const useSeo = (seo: ISeo) => {
  const url = useRequestURL()
  const canonicalUrl = seo.canonicalUrl ?? url.href
  const siteOrigin = url.origin
  const ogType = seo.ogType ?? 'website'
  const ogImage = seo.ogImage

  useSeoMeta({
    title: seo.title,
    ogTitle: seo.title,
    twitterTitle: seo.title,
    description: seo.description,
    ogDescription: seo.description,
    twitterDescription: seo.description,
    ogType,
    ogUrl: canonicalUrl,
    ...(ogImage
      ? { ogImage, twitterImage: ogImage, twitterCard: 'summary_large_image' as const }
      : { twitterCard: 'summary' as const }
    ),
  })

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(buildJsonLd(seo, canonicalUrl, siteOrigin)) }],
  })
}

function buildJsonLd(seo: ISeo, canonicalUrl: string, siteOrigin: string): Record<string, unknown> {
  if (seo.article) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.title,
      description: seo.description,
      ...(seo.ogImage && { image: seo.ogImage }),
      datePublished: seo.article.publishedTime,
      ...(seo.article.modifiedTime && { dateModified: seo.article.modifiedTime }),
      author: { '@type': 'Person', name: seo.article.author },
      publisher: {
        '@type': 'Organization',
        name: 'NeuralBriefly',
        url: siteOrigin,
      },
      url: canonicalUrl,
      ...(seo.article.tags?.length && { keywords: seo.article.tags.join(', ') }),
    }
  }

  if (seo.breadcrumb) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteOrigin },
        {
          '@type': 'ListItem',
          position: 2,
          name: seo.breadcrumb.name,
          item: `${siteOrigin}${seo.breadcrumb.url}`,
        },
      ],
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NeuralBriefly',
    url: siteOrigin,
    description: seo.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteOrigin}/?s={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
