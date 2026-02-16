
const CART_ID = '692be720cc158dd372850d5e';

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('add-to-cart')) {
    const productId = event.target.dataset.id;

    if (CART_ID === 'ID_DEL_CARRITO_A_UTILIZAR') {
      alert('Configura primero el CART_ID en public/js/products.js con un id de carrito válido.');
      return;
    }

    try {
      const res = await fetch(`/api/carts/${CART_ID}/products/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        throw new Error('Respuesta no OK del servidor');
      }

      const data = await res.json();
      console.log('Respuesta agregar al carrito:', data);
      alert('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('No se pudo agregar el producto al carrito');
    }
  }
});
