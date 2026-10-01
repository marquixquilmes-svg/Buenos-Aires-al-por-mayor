# Buenos Aires al por mayor · app iOS/Android

Aplicación nativa Expo con el circuito: pedido a cotizar, cotización, aceptación y pago por Mercado Pago, y seguimiento de envío. Usa las mismas APIs y base de datos que el sitio. No incluye catálogo.

## Desarrollo

Desde `mobile`: `npm install`, `npx expo start`. El servidor Next.js debe tener desplegadas las rutas `/api/quotes` y `/api/mobile/*`. En desarrollo se puede establecer `EXPO_PUBLIC_API_URL=https://tu-servidor-de-pruebas`; por defecto apunta a `https://www.buenosairesalpormayor.com`. La URL es pública; las credenciales del servidor nunca deben incluirse en Expo.

La app guarda el token de sesión en SecureStore. Mercado Pago se abre en un navegador seguro; al regresar, la app consulta nuevamente el estado confirmado por el servidor. La página de retorno no determina que el pago haya sido aprobado.

## Publicación

1. Verificar en un entorno de prueba el circuito con usuarios y credenciales de prueba de Mercado Pago. Confirmar también el webhook firmado, pagos rechazados y cancelados, y eliminación de cuenta.
2. Confirmar el identificador `com.buenosairesalpormayor.app` antes de la primera publicación, y la titularidad de las cuentas Apple Developer y Google Play Console.
3. Crear el proyecto Expo/EAS y los certificados de firma desde la cuenta del titular. Configurar fichas de tienda, política de privacidad, URL de eliminación de cuenta y capturas reales de la app.
4. Ejecutar `npx eas-cli@latest build --platform all --profile production`, probar los binarios y enviar a revisión mediante las cuentas de desarrollador. La revisión y aprobación final dependen de Apple y Google.

Los botones de la app no cobran directamente: el servidor crea la orden de Mercado Pago y comprueba el pago. La app no está publicada hasta completar compilación, pruebas y revisión de las tiendas.
