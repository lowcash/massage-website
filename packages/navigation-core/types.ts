export type SectionBoundary = {
  id: string
  offsetTop: number
}

export type ComputeActiveSectionInput = {
  scrollY: number
  sections: SectionBoundary[]
  offset: number
  innerHeight?: number
  documentHeight?: number
  bottomEpsilon?: number
}
