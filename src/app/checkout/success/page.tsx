export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold">Pago aprobado</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Recibimos tu pago. Tu pedido quedó confirmado y será procesado por nuestro equipo.</p>
      <a className="mt-8 rounded-lg bg-black px-5 py-3 text-white" href="/">Volver a la tienda</a>
    </main>
  );
}
