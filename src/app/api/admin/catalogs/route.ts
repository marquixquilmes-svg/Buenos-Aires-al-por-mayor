import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { listAdminCatalogs } from '@/lib/db/repositories';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ catalogs: await listAdminCatalogs() });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const supplierId = String(body.supplierId ?? '').trim();
    const slug = String(body.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim();
    if (!name || !supplierId || !slug) return NextResponse.json({ error: 'Proveedor, nombre y slug son obligatorios.' }, { status: 400 });
    const result = await getDb().query(
      `insert into catalogs (id, supplier_id, name, slug, description, cover_image_url, active)
       values ($1,$2,$3,$4,$5,$6,$7) returning *`,
      [slug, supplierId, name, slug, body.description || null, body.coverImageUrl || null, body.active !== false],
    );
    return NextResponse.json({ catalog: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Admin catalog create failed', error);
    return NextResponse.json({ error: 'No se pudo crear el catálogo.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const id = String(body.id ?? '');
    if (!id) return NextResponse.json({ error: 'ID requerido.' }, { status: 400 });
    const result = await getDb().query(
      `update catalogs set supplier_id=coalesce($2,supplier_id), name=coalesce($3,name), slug=coalesce($4,slug),
       description=$5, cover_image_url=$6, active=$7, updated_at=now() where id=$1 returning *`,
      [id, body.supplierId || null, body.name || null, body.slug || null, body.description || null, body.coverImageUrl || null, body.active !== false],
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'Catálogo no encontrado.' }, { status: 404 });
    return NextResponse.json({ catalog: result.rows[0] });
  } catch (error) {
    console.error('Admin catalog update failed', error);
    return NextResponse.json({ error: 'No se pudo actualizar el catálogo.' }, { status: 500 });
  }
}
