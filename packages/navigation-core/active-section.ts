import type { ComputeActiveSectionInput, SectionBoundary } from './types'

type IndexedBoundary = SectionBoundary & {
  index: number
}

function toIndexedBoundaries(sections: SectionBoundary[]) {
  return sections
    .map((section, index) => ({ ...section, index }))
    .sort((left, right) => {
      if (left.offsetTop !== right.offsetTop) {
        return left.offsetTop - right.offsetTop
      }

      return left.index - right.index
    })
}

function getFirstByOffset(boundaries: IndexedBoundary[], offsetTop: number) {
  const sameOffsetBoundaries = boundaries.filter((boundary) => boundary.offsetTop === offsetTop)
  if (sameOffsetBoundaries.length === 0) {
    return null
  }

  return sameOffsetBoundaries[0]
}

function getBottomSection(boundaries: IndexedBoundary[]) {
  if (boundaries.length === 0) {
    return null
  }

  const maxOffset = boundaries[boundaries.length - 1].offsetTop
  return getFirstByOffset(boundaries, maxOffset)
}

export function computeActiveSection({
  scrollY,
  sections,
  offset,
  innerHeight,
  documentHeight,
  bottomEpsilon = 2,
}: ComputeActiveSectionInput) {
  const boundaries = toIndexedBoundaries(sections)

  if (boundaries.length === 0) {
    return null
  }

  // Require a real scroll range. A position:fixed body lock collapses scrollHeight ≈ innerHeight
  // and would otherwise always report the last section (Kontakt) as active.
  if (
    typeof innerHeight === 'number' &&
    typeof documentHeight === 'number' &&
    documentHeight > innerHeight + bottomEpsilon &&
    innerHeight + scrollY >= documentHeight - bottomEpsilon
  ) {
    return getBottomSection(boundaries)?.id ?? null
  }

  const marker = scrollY + offset
  let candidateOffset: number | null = null

  for (let index = boundaries.length - 1; index >= 0; index -= 1) {
    if (boundaries[index].offsetTop <= marker) {
      candidateOffset = boundaries[index].offsetTop
      break
    }
  }

  if (candidateOffset === null) {
    return null
  }

  return getFirstByOffset(boundaries, candidateOffset)?.id ?? null
}
