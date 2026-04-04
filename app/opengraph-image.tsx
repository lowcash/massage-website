import { ImageResponse } from 'next/og'

export const alt = 'Pohlazení po těle a duši - Masáže Hodonín'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(140deg, #f6edeb 0%, #efe1dc 45%, #e7d3cb 100%)',
          color: '#2d1d1a',
          fontFamily: 'serif',
          overflow: 'hidden',
          padding: '64px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-80px',
            width: '380px',
            height: '380px',
            borderRadius: '9999px',
            border: '1px solid rgba(45, 29, 26, 0.18)',
            background: 'rgba(255, 255, 255, 0.22)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            border: '1px solid rgba(45, 29, 26, 0.18)',
            background: 'rgba(255, 255, 255, 0.45)',
            padding: '56px',
          }}
        >
          <div style={{ fontSize: 32, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.82 }}>
            Masaze Hodonin
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: 76, lineHeight: 1.04, fontWeight: 700, maxWidth: '88%' }}>
              Pohlazeni po tele a dusi
            </div>
            <div style={{ fontSize: 30, lineHeight: 1.35, maxWidth: '88%', opacity: 0.86 }}>
              Dotek, ktery ulevi. Pece, ktera obnovi.
            </div>
          </div>

          <div style={{ fontSize: 26, opacity: 0.78 }}>pohlazenipoteleadusi.cz</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
