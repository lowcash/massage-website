import { ImageResponse } from 'next/og'

import { OPEN_GRAPH_IMAGE, SITE_IDENTITY } from '@/lib/config/site-config'

export const alt = OPEN_GRAPH_IMAGE.alt
export const size = OPEN_GRAPH_IMAGE.size

export const contentType = 'image/png'

const SITE_HOST = new URL(SITE_IDENTITY.url).host

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
            {OPEN_GRAPH_IMAGE.eyebrow}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: 76, lineHeight: 1.04, fontWeight: 700, maxWidth: '88%' }}>
              {OPEN_GRAPH_IMAGE.headline}
            </div>
            <div style={{ fontSize: 30, lineHeight: 1.35, maxWidth: '88%', opacity: 0.86 }}>
              {OPEN_GRAPH_IMAGE.description}
            </div>
          </div>

          <div style={{ fontSize: 26, opacity: 0.78 }}>{SITE_HOST}</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
