import { NextResponse } from 'next/server';

const SOURCES: Record<string, string> = {
  '8f7b7d7e-7d7e-4f8d-8a11-000000000108': 'https://www.avellanedaauntoque.com/p/0RARNQ9',
  '8f7b7d7e-7d7e-4f8d-8a11-000000000106': 'https://www.grupoarmar.com.ar/tienda/articulo/91692',
  '8f7b7d7e-7d7e-4f8d-8a11-000000000115': 'https://www.elcelu.com.ar/masajeadores/8967-masajeador-electrico-cervical-portatil-8-rodillos-7799135017733.html',
  '8f7b7d7e-7d7e-4f8d-8a11-000000000112': 'https://www.elcelu.com.ar/lamparas/18497-l%C3%A1mpara-velador-led-recargable-usb-t%C3%A1ctil-1200mah-38cm-negro-7799135015463.html',
  '8f7b7d7e-7d7e-4f8d-8a11-000000000110': 'https://www.pantherdistribuciones.com.ar/productos/espejo-led-aitech-recargable-para-auto-jlueo/',
  '8f7b7d7e-7d7e-4f8d-8a11-000000000114': 'https://www.ordunacell.com.ar/producto/espejo-triple-maquillaje-aitech-con-luz-led-carga-usb-blanco/',
  '8f7b7d7e-7d7e-4f8d-8a11-000000000116': 'https://www.comex-sileo.com.ar/pizarra-magica-lcd-8-pulgadas-para-ni-os-colores-surtidos-ec100103',
};

function extractImage(html: string, source: string) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      try { return new URL(match[1], source).toString(); } catch { return null; }
    }
  }
  return null;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const source = SOURCES[id];
  if (!source) return new NextResponse('Product image not configured', { status: 404 });

  try {
    const response = await fetch(source, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; BuenosAiresAlPorMayor/1.0)' },
      next: { revalidate: 86400 },
    });
    if (!response.ok) return new NextResponse('Source unavailable', { status: 502 });
    const html = await response.text();
    const image = extractImage(html, source);
    if (!image) return new NextResponse('Product image not found', { status: 404 });
    return NextResponse.redirect(image, { status: 302, headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400' } });
  } catch {
    return new NextResponse('Product image unavailable', { status: 502 });
  }
}
