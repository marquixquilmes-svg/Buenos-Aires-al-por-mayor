export default function CheckoutPendingPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold">Pago pendiente</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Mercado Pago todavía está procesando el pago. Conservamos tu pedido y actualizaremos su estado cuando recibamos la confirmación.</p>
      <a className="mt-8 rounded-lg bg-black px-5 py-3 text-white" href="/">Volver a la tienda</a>
    </main>
  );
}
