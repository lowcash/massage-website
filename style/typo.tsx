import React from 'react'

export const H2 = (p: React.HTMLAttributes<HTMLElement>) => <h2 {...p} className='section-title text-4xl md:text-5xl' />

export const Description = (p: React.HTMLAttributes<HTMLElement>) => (
  <p {...p} className='mx-auto mt-2 max-w-2xl font-sans text-lg text-gray-600' />
)
