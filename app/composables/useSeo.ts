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

  const scripts: { type: string; innerHTML: string }[] = [
    { type: 'application/ld+json', innerHTML: JSON.stringify(buildMainJsonLd(seo, canonicalUrl, siteOrigin)) },
  ]

  if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(buildBreadcrumbJsonLd(seo.breadcrumbs, siteOrigin)),
    })
  }

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: scripts,
  })
}

function buildMainJsonLd(seo: ISeo, canonicalUrl: string, siteOrigin: string): Record<string, unknown> {
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

  if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: seo.title,
      description: seo.description,
      url: canonicalUrl,
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
        urlTemplate: `${siteOrigin}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

function buildBreadcrumbJsonLd(
  breadcrumbs: Array<{ name: string; url: string }>,
  siteOrigin: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteOrigin}${crumb.url}`,
    })),
  }
}
