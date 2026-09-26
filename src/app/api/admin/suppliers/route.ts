import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { listAdminSuppliers } from '@/lib/db/repositories';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ suppliers: await listAdminSuppliers() });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const slug = String(body.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim();
    if (!name || !slug) return NextResponse.json({ error: 'Nombre y slug son obligatorios.' }, { status: 400 });
    const result = await getDb().query(
      `insert into suppliers (id, name, slug, location, website, instagram, whatsapp, verified, active)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       returning *`,
      [slug, name, slug, body.location || null, body.website || null, body.instagram || null, body.whatsapp || null, body.verified !== false, body.active !== false],
    );
    return NextResponse.json({ supplier: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Admin supplier create failed', error);
    return NextResponse.json({ error: 'No se pudo crear el proveedor.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const id = String(body.id ?? '');
    if (!id) return NextResponse.json({ error: 'ID requerido.' }, { status: 400 });
    const result = await getDb().query(
      `update suppliers set name=coalesce($2,name), slug=coalesce($3,slug), location=$4, website=$5,
       instagram=$6, whatsapp=$7, verified=$8, active=$9, updated_at=now() where id=$1 returning *`,
      [id, body.name || null, body.slug || null, body.location || null, body.website || null, body.instagram || null, body.whatsapp || null, body.verified !== false, body.active !== false],
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'Proveedor no encontrado.' }, { status: 404 });
    return NextResponse.json({ supplier: result.rows[0] });
  } catch (error) {
    console.error('Admin supplier update failed', error);
    return NextResponse.json({ error: 'No se pudo actualizar el proveedor.' }, { status: 500 });
  }
}
