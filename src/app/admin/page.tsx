import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hashToken, sessionCookie } from '@/lib/auth';
import { findSessionByTokenHash, listAdminOrders, syncPendingMercadoPagoOrders } from '@/lib/db/repositories';
import AdminCatalogManager from '@/components/AdminCatalogManager';

export const dynamic = 'force-dynamic';

const money = (value: number | string) => `$${Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
const date = (value: string | Date) => new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });

const statusLabel: Record<string, string> = { pending: 'Pendiente', confirmed: 'Confirmado', preparing: 'Preparando', shipped: 'Enviado', cancelled: 'Cancelado' };
const paymentLabel: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado', cancelled: 'Cancelado' };

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie.name)?.value;
  const session = token ? await findSessionByTokenHash(hashToken(token)) : null;
  if (!session || session.role !== 'admin') redirect('/login?next=/admin');

  await syncPendingMercadoPagoOrders();
  const orders = await listAdminOrders();
  const pending = orders.filter((order) => order.status === 'pending').length;
  const approved = orders.filter((order) => order.payment_status === 'approved').length;
  const revenue = orders.filter((order) => order.payment_status === 'approved').reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <main style={{ minHeight: '100vh', padding: '40px 6%', background: '#f7f7f5', color: '#171717' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div><p style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 11, marginBottom: 8 }}>Administración</p><h1 style={{ margin: 0, fontSize: 42 }}>Centro de control</h1><p style={{ color: '#666', marginTop: 8 }}>Pedidos, proveedores, catálogos y productos de Buenos Aires al por mayor.</p></div>
        <a href="/" style={{ fontSize: 14 }}>← Ver tienda</a>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, margin: '35px 0' }}>
        {[['Pedidos', orders.length], ['Pendientes', pending], ['Pagados', approved], ['Facturado', money(revenue)]].map(([label, value]) => <div key={label} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, padding: 22 }}><div style={{ color: '#777', fontSize: 13 }}>{label}</div><strong style={{ display: 'block', fontSize: 30, marginTop: 8 }}>{value}</strong></div>)}
      </section>

      <section style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, padding: 24, overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 18 }}><div><h2 style={{ margin: 0 }}>Pedidos recibidos</h2><p style={{ color: '#666', margin: '6px 0 0' }}>Los pagos pendientes se reconcilian automáticamente con Mercado Pago al abrir el panel.</p></div><span style={{ color: '#666', fontSize: 13 }}>Admin: {session.email}</span></div>
        {orders.length === 0 ? <div style={{ padding: '40px 10px', color: '#666', textAlign: 'center' }}>Todavía no hay pedidos registrados.</div> : <div style={{ display: 'grid', gap: 12 }}>{orders.map((order) => <details key={order.id} style={{ border: '1px solid #e8e8e8', borderRadius: 12, padding: 0, background: '#fff' }}>
          <summary style={{ cursor: 'pointer', listStyle: 'none', padding: 18 }}><div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px,1.5fr) repeat(4,minmax(110px,1fr))', gap: 14, alignItems: 'center' }}><div><strong>{order.guest_name || 'Cliente registrado'}</strong><div style={{ color: '#777', fontSize: 12, marginTop: 4 }}>#{String(order.id).slice(0, 8)} · {date(order.created_at)}</div></div><div><span style={{ color: '#777', fontSize: 11, display: 'block' }}>Estado</span>{statusLabel[order.status] ?? order.status}</div><div><span style={{ color: '#777', fontSize: 11, display: 'block' }}>Pago</span>{paymentLabel[order.payment_status] ?? order.payment_status}</div><div><span style={{ color: '#777', fontSize: 11, display: 'block' }}>Productos</span>{order.items.length}</div><strong>{money(order.total)}</strong></div></summary>
          <div style={{ borderTop: '1px solid #eee', padding: 20, display: 'grid', gridTemplateColumns: 'minmax(260px,1fr) minmax(260px,1fr)', gap: 24 }}>
            <div><h3 style={{ marginTop: 0 }}>Cliente</h3><p><strong>Nombre:</strong> {order.guest_name || '—'}</p><p><strong>Email:</strong> {order.guest_email || '—'}</p><p><strong>Teléfono:</strong> {order.guest_phone || '—'}</p><p><strong>Dirección:</strong> {order.guest_address || '—'}</p><p><strong>Pedido creado:</strong> {date(order.created_at)}</p><p><strong>Términos aceptados:</strong> {order.accepted_terms_at ? date(order.accepted_terms_at) : '—'}</p></div>
            <div><h3 style={{ marginTop: 0 }}>Pedido</h3><div style={{ borderTop: '1px solid #eee' }}>{order.items.map((item: { productName: string; quantity: number; unitPrice: number | string; sku?: string|null; supplierName?: string|null; catalogName?: string|null }, index: number) => <div key={`${order.id}-${index}`} style={{ padding: '11px 0', borderBottom: '1px solid #eee' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 15 }}><span>{item.quantity} × {item.productName}</span><strong>{money(Number(item.unitPrice) * Number(item.quantity))}</strong></div><div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Proveedor: <strong>{item.supplierName || 'Sin asignar'}</strong> · Catálogo: <strong>{item.catalogName || 'Sin asignar'}</strong>{item.sku ? ` · SKU: ${item.sku}` : ''}</div></div>)}</div><div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, fontSize: 18 }}><strong>Total</strong><strong>{money(order.total)}</strong></div><p style={{ color: '#666', fontSize: 13, marginTop: 16 }}><strong>Mercado Pago:</strong> {paymentLabel[order.payment_status] ?? order.payment_status} {order.payment_status_detail ? `· ${order.payment_status_detail}` : ''}</p>{order.payment_order_id && <p style={{ color: '#666', fontSize: 12, wordBreak: 'break-all' }}>ID de pago: {order.payment_order_id}</p>}</div>
          </div>
        </details>)}</div>}
      </section>

      <AdminCatalogManager />
    </main>
  );
}
