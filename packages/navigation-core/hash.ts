function hashForSection(sectionId: string, clearSectionId: string) {
  return sectionId === clearSectionId ? '' : `#${sectionId}`
}

export function buildSectionUrl(params: {
  pathname: string
  search: string
  sectionId: string
  clearSectionId: string
}) {
  const nextHash = hashForSection(params.sectionId, params.clearSectionId)
  return `${params.pathname}${params.search}${nextHash}`
}

export function shouldWriteSectionUrl(currentUrl: string, nextUrl: string) {
  return currentUrl !== nextUrl
}
