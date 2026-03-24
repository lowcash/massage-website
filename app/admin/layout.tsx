import { Toaster } from '@/src/components/ui/sonner'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex min-h-screen flex-col bg-linear-to-b from-white to-[#fef8fb]'>
      {children}
      <Toaster richColors />
    </div>
  )
}
