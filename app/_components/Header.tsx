import Image from 'next/image'

export default function Header() {
  return (
    <header className='bg-white shadow-md sticky top-0 z-50'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        {/* Logo */}
        <Image src='/logo.png' alt='Next.js logo' width={180} height={38} priority />

        {/* Navigation */}
        <nav>
          <ul className='flex space-x-6 text-gray-600'>
            <li>
              <NavItem href='#massages'>Masáže</NavItem>
            </li>
            <li>
              <NavItem href='#about'>O nás</NavItem>
            </li>
            <li>
              <NavItem href='#contact'>Kontakt</NavItem>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function NavItem({ children, ...p }: React.PropsWithChildren<{ href: string }>) {
  return (
    <a href={p.href} className='hover:text-gray-800 transition-colors uppercase'>
      {children}
    </a>
  )
}
