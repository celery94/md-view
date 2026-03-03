import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MD-View Guide: Features & Markdown Basics';
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
            'linear-gradient(130deg, rgb(248, 250, 252) 0%, rgb(224, 242, 254) 50%, rgb(204, 251, 241) 100%)',
          color: 'rgb(15, 23, 42)',
          fontFamily: 'system-ui, sans-serif',
          border: '1px solid rgba(15, 23, 42, 0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'rgb(15, 23, 42)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              M
            </div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>MD-View</div>
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: 999,
              background: 'rgba(2, 132, 199, 0.12)',
              color: 'rgb(3, 105, 161)',
            }}
          >
            User Guide
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em' }}>
            Features & Markdown Basics
          </div>
          <div style={{ fontSize: 29, color: 'rgb(51, 65, 85)' }}>
            Workflows, shortcuts, syntax examples, and export tips.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: 21, color: 'rgb(71, 85, 105)' }}>
          <span>Live Preview</span>
          <span>•</span>
          <span>GFM</span>
          <span>•</span>
          <span>Import & Export</span>
        </div>
      </div>
    ),
    size
  );
}
