export default function Home() {
  return <main className="appHome">
    <header className="appHomeHeader"><img src="/brand-logo-wide.svg" alt="Buenos Aires al por mayor" /><div><a href="/login?next=/cotizar">Ingresar</a><a href="/cotizar" className="button button-primary">Mis pedidos</a></div></header>
    <section className="appHomeHero"><span className="eyebrow">Buenos Aires al por mayor</span><h1>Vos pedís.<br /><em>Nosotros cotizamos.</em></h1><p>Contanos qué producto buscás, recibí un precio, aceptá y pagá con Mercado Pago. Seguí tu envío desde la app.</p><a href="/cotizar" className="button button-primary">Hacer un pedido a cotizar →</a></section>
    <section className="appHomeSteps"><h2>Un pedido, cuatro pasos</h2><div>{[['01','Hacé tu pedido','Describí lo que querés y la cantidad.'],['02','Recibí la cotización','Te informamos precio, envío y vigencia.'],['03','Aceptá y pagá','Pagá de forma segura con Mercado Pago.'],['04','Seguí el envío','Consultá cada avance desde tu cuenta.']].map(([n,title,copy])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <footer className="appHomeFooter">Buenos Aires al por mayor · <a href="/terminos-y-condiciones">Términos</a> · <a href="/privacidad">Privacidad</a> · <a href="/eliminar-cuenta">Eliminar cuenta</a></footer>
  </main>;
}
