import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MD-View - Real-time Markdown Editor & Live Preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px',
          background:
            'linear-gradient(120deg, rgb(15, 23, 42) 0%, rgb(14, 116, 144) 52%, rgb(13, 148, 136) 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            M
          </div>
          MD-View
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em' }}>
            Real-time Markdown Editor
          </div>
          <div style={{ fontSize: 30, opacity: 0.92 }}>
            Live preview, publish-style themes, and one-click export.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '14px', fontSize: 22, opacity: 0.95 }}>
          <span>GFM</span>
          <span>•</span>
          <span>Import URL</span>
          <span>•</span>
          <span>Export HTML/DOCX/PNG</span>
        </div>
      </div>
    ),
    size
  );
}
