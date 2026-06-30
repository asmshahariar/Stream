import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const streamUrl = new URL(url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Referer': streamUrl.origin + '/',
        'Origin': streamUrl.origin,
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch upstream stream' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || '';
    
    // If it's an M3U8 playlist, rewrite the internal URLs to point back to our proxy
    if (url.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('apple.mpegurl')) {
      let text = await response.text();
      const baseUrl = new URL('.', url).href; 

      const lines = text.split('\n');
      const rewrittenLines = lines.map(line => {
        line = line.trim();
        // If it's a URL line (not a comment/tag and not empty)
        if (line && !line.startsWith('#')) {
          const absoluteUrl = new URL(line, baseUrl).href;
          return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
        }
        // Handle URI inside tags (e.g. #EXT-X-KEY:METHOD=AES-128,URI="...")
        if (line.startsWith('#EXT-X-')) {
            return line.replace(/URI="(.*?)"/g, (match, p1) => {
                const absoluteUrl = new URL(p1, baseUrl).href;
                return `URI="/api/proxy?url=${encodeURIComponent(absoluteUrl)}"`;
            });
        }
        return line;
      });

      const rewrittenText = rewrittenLines.join('\n');
      
      return new NextResponse(rewrittenText, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/vnd.apple.mpegurl',
        },
      });
    } else {
      // For .ts video chunks or other data, stream it directly via ReadableStream
      return new NextResponse(response.body, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': contentType || 'video/MP2T',
          'Cache-Control': 'no-cache, no-store, must-revalidate, no-transform',
          'X-Accel-Buffering': 'no',
        },
      });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: 'Proxy error occurred' }, { status: 500 });
  }
}
