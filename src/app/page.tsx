import { products, categories } from '@/lib/catalog';
import { BUSINESS_CONTACT } from '@/lib/business';
import { AddToCartButton } from '@/components/AddToCartButton';

const squareLogo = '/brand-logo-circle.svg';
const wideLogo = '/brand-logo-wide.svg';

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <a href="/" className="brand" aria-label="Buenos Aires al por mayor - inicio">
          <img src={squareLogo} alt="Buenos Aires al por mayor" className="brand-logo" />
          <span className="brand-copy"><strong>BUENOS AIRES</strong><small>AL POR MAYOR</small></span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#catalogo">Catálogo</a><a href="/proveedores-once">Proveedores</a><a href="#contacto">Contacto</a><a href="/registro">Crear cuenta</a><a href="/login">Ingresar</a><a href="/carrito" className="cart-link">🛒 Carrito</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
        <div className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow">Marketplace mayorista · Buenos Aires</span>
            <h1>El mayorista de Buenos Aires, <em>más cerca de tu negocio.</em></h1>
            <p className="hero-lead">Centralizamos catálogos, pedidos y atención para que puedas comprar productos mayoristas de Buenos Aires de forma simple, clara y segura.</p>
            <div className="hero-actions"><a href="#catalogo" className="button button-primary">Ver catálogo</a><a href={`${BUSINESS_CONTACT.whatsappUrl}?text=${encodeURIComponent('Hola, quiero consultar por Buenos Aires al por mayor')}`} target="_blank" rel="noreferrer" className="button button-secondary">Consultar por WhatsApp</a></div>
            <div className="hero-trust"><span>✓ Atención centralizada</span><span>✓ Pedido online</span><span>✓ Envíos a todo el país</span></div>
          </div>
          <div className="hero-brand-card">
            <img src={wideLogo} alt="Buenos Aires al por mayor" className="hero-wide-logo" />
            <div className="hero-brand-caption"><strong>Comprá mayorista. Vendé mejor.</strong><span>Catálogos · Pedidos · Atención centralizada</span></div>
          </div>
        </div>
      </section>

      <section className="benefits"><div className="section-container benefit-grid">
        <article className="benefit-card"><span className="benefit-icon">01</span><div><h3>Catálogos centralizados</h3><p>Encontrá distintas opciones de proveedores desde un mismo lugar.</p></div></article>
        <article className="benefit-card"><span className="benefit-icon">02</span><div><h3>Atención directa</h3><p>Tu consulta y tu pedido son gestionados por Buenos Aires al por mayor.</p></div></article>
        <article className="benefit-card"><span className="benefit-icon">03</span><div><h3>Comprá desde cualquier provincia</h3><p>Una plataforma pensada para acercar Buenos Aires a tu negocio.</p></div></article>
      </div></section>

      <section id="categorias" className="section-container categories-section">
        <div className="section-heading"><div><span className="eyebrow dark">Explorá nuestras categorías</span><h2>Todo lo que tu negocio necesita</h2></div><p>Seleccioná una categoría y descubrí productos disponibles para compra mayorista.</p></div>
        <div className="category-grid">{categories.map((category, index) => <a href={`/catalogo?categoria=${encodeURIComponent(category)}`} key={category} className="category-card"><span>{String(index + 1).padStart(2, '0')}</span><strong>{category}</strong><small>Ver productos →</small></a>)}</div>
      </section>

      <section id="catalogo" className="catalog-section"><div className="section-container">
        <div className="section-heading catalog-heading"><div><span className="eyebrow dark">Catálogo mayorista</span><h2>Productos destacados</h2></div><a href="/carrito" className="text-link">Ver carrito →</a></div>
        <div className="product-grid">{products.map((product) => <article key={product.id} className="product-card"><div className="product-image"><span>{product.category}</span><div>📱</div></div><div className="product-info"><h3>{product.name}</h3><div className="product-price">${product.price.toLocaleString('es-AR')}</div><p>Por {product.unit}</p><AddToCartButton product={product} /></div></article>)}</div>
      </div></section>

      <section className="contact-banner"><div className="section-container contact-inner"><div><span className="eyebrow">Atención centralizada</span><h2>Hablemos de tu próximo pedido.</h2><p>Consultá por productos, disponibilidad, proveedores y envíos. Te atendemos directamente desde Buenos Aires al por mayor.</p></div><a href={`${BUSINESS_CONTACT.whatsappUrl}?text=${encodeURIComponent('Hola, quiero consultar por un pedido mayorista')}`} target="_blank" rel="noreferrer" className="button button-light">Hablar por WhatsApp</a></div></section>

      <footer id="contacto" className="site-footer">
        <div className="section-container footer-grid">
          <div className="footer-brand footer-brand-wide"><img src={wideLogo} alt="Buenos Aires al por mayor" /><div><strong>Buenos Aires al por mayor</strong><p>Marketplace mayorista · Buenos Aires</p></div></div>
          <div className="footer-column"><h3>Contacto</h3><a href={BUSINESS_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp: +54 9 11 7250-2826</a><a href={BUSINESS_CONTACT.instagramUrl} target="_blank" rel="noreferrer">Instagram: @buenosairesalpormayor</a></div>
          <div className="footer-column"><h3>Emails</h3>{BUSINESS_CONTACT.emails.map((email) => <a href={`mailto:${email}`} key={email}>{email}</a>)}</div>
        </div>
        <div className="footer-bottom"><div className="section-container"><span>© {new Date().getFullYear()} Buenos Aires al por mayor</span><span>Comprá mayorista. Vendé mejor.</span></div></div>
      </footer>
    </main>
  );
}
