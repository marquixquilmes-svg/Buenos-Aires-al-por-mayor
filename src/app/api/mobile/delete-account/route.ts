import { NextRequest, NextResponse } from 'next/server';
import { getRequestSession } from '@/lib/session';
import { ensureDatabaseReady } from '@/lib/db/client';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  const session = await getRequestSession(request);
  if (!session || session.role !== 'customer') return NextResponse.json({ error:'No autorizado.' },{status:401});
  const body = await request.json().catch(()=>null);
  const password = String(body?.password ?? '');
  const db = await ensureDatabaseReady();
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const user = await client.query('select password_hash from users where id=$1 for update',[session.user_id]);
    if (!user.rows[0] || !await verifyPassword(password,user.rows[0].password_hash)) {
      await client.query('ROLLBACK'); return NextResponse.json({ error:'Contraseña incorrecta.' },{status:403});
    }
    await client.query(`delete from quote_requests where user_id=$1 and status in ('requested','quoted','cancelled')`,[session.user_id]);
    await client.query(`update quote_requests set user_id=null,description='Pedido de cuenta eliminada',reference_url=null,delivery_address='',phone='',quote_note=null,tracking=null,updated_at=now() where user_id=$1`,[session.user_id]);
    await client.query(`update orders set user_id=null,guest_name=null,guest_email=null,guest_phone=null,guest_address=null,updated_at=now() where user_id=$1`,[session.user_id]);
    await client.query('delete from users where id=$1',[session.user_id]);
    await client.query('COMMIT');
    return NextResponse.json({ ok:true });
  } catch(error) {
    await client.query('ROLLBACK').catch(()=>undefined);
    console.error('Account deletion failed',error);
    return NextResponse.json({ error:'No se pudo eliminar la cuenta.' },{status:500});
  } finally { client.release(); }
}
