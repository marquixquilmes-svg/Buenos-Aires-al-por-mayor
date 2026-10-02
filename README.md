# Buenos Aires al por mayor

App web para pedidos a cotizar. La pantalla principal lleva a `/cotizar`: solicitud, cotización, aceptación con Mercado Pago y seguimiento. El catálogo anterior sigue en rutas secundarias para preservar los pedidos existentes, pero no forma parte de este circuito.

## Configuración

`npm install`, `npm run build`, `npm run dev`. Se requieren las variables de entorno existentes de la base PostgreSQL/Neon, `MP_ACCESS_TOKEN` y `MP_WEBHOOK_SECRET`. No incluir sus valores en el repositorio. El webhook de Mercado Pago debe apuntar a `/api/mercadopago/webhook` y aceptar eventos de órdenes, como en la integración existente.

La tabla `quote_requests` se crea con la migración idempotente al iniciar el servidor. No modifica ni elimina pedidos anteriores. Los clientes deben ingresar o crear una cuenta; el administrador usa su cuenta con rol `admin`.

La app iOS/Android está en `mobile/`. Reutiliza las rutas del servidor con sesiones móviles seguras y abre Mercado Pago para completar el cobro. La URL pública `/eliminar-cuenta` y la pantalla de cuenta móvil permiten eliminar una cuenta; los registros de pagos quedan desasociados de la identidad del cliente.

## Flujo

1. Cliente: solicita precio desde `/cotizar` con categoría, descripción, cantidad y entrega.
2. Administrador: en `/admin`, carga precio de productos, envío, vigencia y nota.
3. Cliente: acepta la cotización vigente; el servidor crea la orden de Mercado Pago y redirige al checkout.
4. El webhook firmado, o la consulta posterior a Mercado Pago, confirma el pago. El regreso del navegador por sí solo no marca el pedido como pagado.
5. Administrador: marca preparación, envío y entrega; puede incluir código de seguimiento.

El total cotizado incluye productos y envío, en pesos argentinos. Probá el circuito completo con credenciales de prueba y usuarios de prueba de Mercado Pago antes de publicarlo. La nueva ruta de cotizaciones no tiene aún carga de imágenes ni notificaciones automáticas; el cliente consulta sus estados dentro de la app.
