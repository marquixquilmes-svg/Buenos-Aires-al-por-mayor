export default function CheckoutFailurePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold">No pudimos completar el pago</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">El pedido quedó pendiente y podés intentar el pago nuevamente desde el checkout.</p>
      <a className="mt-8 rounded-lg bg-black px-5 py-3 text-white" href="/">Volver a la tienda</a>
    </main>
  );
}
