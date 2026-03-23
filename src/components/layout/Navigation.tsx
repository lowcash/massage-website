'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

import { siteContent } from '@/lib/content'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavigationClick = (href: string) => {
    const sectionId = href.replace('#', '')
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const heroElement = document.getElementById('hero')

    if (!heroElement) {
      const handleScrollFallback = () => {
        setIsScrolled(window.scrollY > 24)
      }

      handleScrollFallback()
      window.addEventListener('scroll', handleScrollFallback, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScrollFallback)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting)
      },
      {
        threshold: 0.2,
        rootMargin: '-88px 0px 0px 0px',
      }
    )

    observer.observe(heroElement)

    const handleScrollSync = () => {
      const heroBottom = heroElement.getBoundingClientRect().bottom
      setIsScrolled(heroBottom <= 88)
    }

    handleScrollSync()
    window.addEventListener('scroll', handleScrollSync, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScrollSync)
    }
  }, [])

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isScrolled ? 'rgba(246, 237, 235, 0.94)' : 'rgba(0, 0, 0, 0)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
          boxShadow: isScrolled ? '0 10px 24px rgba(62, 34, 27, 0.09)' : '0 0 0 rgba(0,0,0,0)',
          borderBottomColor: isScrolled ? 'rgba(214, 178, 169, 0.3)' : 'rgba(255,255,255,0)',
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className='fixed top-0 right-0 left-0 z-50 border-b'
      >
        <nav className='mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8'>
          <button
            type='button'
            onClick={() => handleNavigationClick('#hero')}
            className={
              isScrolled
                ? 'font-dancing text-3xl leading-none text-[#5f3b36] transition'
                : 'font-dancing text-3xl leading-none text-white drop-shadow-md transition'
            }
            aria-label={siteContent.navigation.homeAriaLabel}
          >
            {siteContent.brand.name}
          </button>

          <div className='hidden items-center gap-8 md:flex'>
            {siteContent.navigation.items.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => handleNavigationClick(item.href)}
                className={
                  isScrolled
                    ? 'text-xs tracking-[0.22em] text-[#6e4d48] uppercase transition hover:text-[#b96657]'
                    : 'text-xs tracking-[0.22em] text-white uppercase transition hover:text-[#ffd8cf]'
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type='button'
            onClick={() => setIsMobileMenuOpen(true)}
            className={
              isScrolled
                ? 'flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b2aa] bg-white/70 text-[#6e4d48] md:hidden'
                : 'flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/10 text-white md:hidden'
            }
            aria-label={siteContent.navigation.openMenuAriaLabel}
          >
            <Menu className='h-5 w-5' />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className='fixed inset-0 z-50 bg-black/45'
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className='fixed top-0 right-0 bottom-0 z-50 flex w-[86%] max-w-sm flex-col border-l border-[#e4cfc9] bg-[#f8ede9]/95 px-6 py-6 backdrop-blur-xl'
            >
              <div className='mb-10 flex items-center justify-between'>
                <span className='font-dancing text-3xl text-[#5f3b36]'>
                  {siteContent.brand.name}
                </span>

                <button
                  type='button'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-[#d5b6ae] bg-white/70 text-[#6e4d48]'
                  aria-label={siteContent.navigation.closeMenuAriaLabel}
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='flex flex-col gap-3'>
                {siteContent.navigation.items.map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleNavigationClick(item.href)}
                    className='rounded-2xl border border-[#e5d0cb] bg-white/70 px-5 py-4 text-left text-sm tracking-[0.2em] text-[#5f3b36] uppercase transition hover:bg-white'
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className='mt-auto rounded-2xl border border-[#e5d0cb] bg-white/70 px-5 py-4 text-sm leading-7 text-[#6b5551]'>
                <p>{siteContent.brand.phone}</p>
                <p>{siteContent.brand.email}</p>
                <p>{siteContent.brand.addressLine1}</p>
                <p>{siteContent.brand.addressLine2}</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}