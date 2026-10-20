import { Toaster } from '@/src/components/ui/sonner'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-surface flex min-h-screen flex-col'>
      {children}
      <Toaster richColors />
    </div>
  )
}
