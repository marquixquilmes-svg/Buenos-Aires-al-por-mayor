import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { listAdminProducts } from '@/lib/db/repositories';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ products: await listAdminProducts() });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const id = String(body.id ?? crypto.randomUUID());
    const name = String(body.name ?? '').trim();
    const slug = String(body.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim();
    if (!name || !slug) return NextResponse.json({ error: 'Nombre y slug son obligatorios.' }, { status: 400 });
    const result = await getDb().query(
      `insert into products (id,name,slug,category,price,stock,active,supplier_id,catalog_id,sku,image_url,description,featured)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning *`,
      [id, name, slug, body.category || 'General', Number(body.price || 0), Number(body.stock ?? 0), body.active !== false, body.supplierId || null, body.catalogId || null, body.sku || null, body.imageUrl || null, body.description || null, body.featured === true],
    );
    if (Array.isArray(body.images)) await replaceProductImages(id, body.images);
    return NextResponse.json({ product: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Admin product create failed', error);
    return NextResponse.json({ error: 'No se pudo crear el producto.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const id = String(body.id ?? '');
    if (!id) return NextResponse.json({ error: 'ID requerido.' }, { status: 400 });
    const result = await getDb().query(
      `update products set name=coalesce($2,name), slug=coalesce($3,slug), category=coalesce($4,category),
       price=coalesce($5,price), stock=coalesce($6,stock), active=$7, supplier_id=$8, catalog_id=$9,
       sku=$10, image_url=$11, description=$12, featured=$13, updated_at=now() where id=$1 returning *`,
      [id, body.name || null, body.slug || null, body.category || null, body.price === undefined ? null : Number(body.price), body.stock === undefined ? null : Number(body.stock), body.active !== false, body.supplierId || null, body.catalogId || null, body.sku || null, body.imageUrl || null, body.description || null, body.featured === true],
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
    if (Array.isArray(body.images)) await replaceProductImages(id, body.images);
    return NextResponse.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Admin product update failed', error);
    return NextResponse.json({ error: 'No se pudo actualizar el producto.' }, { status: 500 });
  }
}

async function replaceProductImages(productId: string, images: unknown[]) {
  const db = getDb();
  await db.query('delete from product_images where product_id = $1', [productId]);
  for (let index = 0; index < images.length; index += 1) {
    const image = images[index];
    const url = typeof image === 'string' ? image.trim() : String((image as { url?: unknown })?.url ?? '').trim();
    if (!url) continue;
    const alt = typeof image === 'string' ? null : String((image as { alt?: unknown })?.alt ?? '').trim() || null;
    await db.query(
      'insert into product_images (product_id, image_url, alt_text, sort_order) values ($1,$2,$3,$4)',
      [productId, url, alt, index],
    );
  }
}
