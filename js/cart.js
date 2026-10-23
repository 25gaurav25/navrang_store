class CartManager {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => this.initCartPage());
  }

  initCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return; 

    if (!localStorage.getItem("navrang_user")) {
      window.location.href = "auth.html";
      return;
    }
  }

  // NEW: Handles the +/- button clicks
  updateQty(buttonElement, change) {
    const row = buttonElement.closest('.item-row');
    const qtyDisplay = row.querySelector('.qty-display');
    let currentQty = parseInt(qtyDisplay.innerText);
    
    let newQty = currentQty + change;
    if (newQty < 0) newQty = 0; // Stops counter from going below zero
    
    qtyDisplay.innerText = newQty;
    this.calculateTotal();
  }

  // UPDATED: Multiplies price by quantity
  calculateTotal() {
    let total = 0;
    const rows = document.querySelectorAll('.item-row');
    
    rows.forEach(row => {
      const price = parseInt(row.getAttribute('data-price'));
      const qty = parseInt(row.querySelector('.qty-display').innerText);
      total += (price * qty);
    });

    const totalDisplay = document.getElementById('cart-total');
    if (totalDisplay) {
      totalDisplay.innerText = `₹${total}`;
    }
  }

  // UPDATED: Gathers quantities for the database
  async checkout() {
    const userId = localStorage.getItem("navrang_user");
    if (!userId) {
      window.location.href = "auth.html";
      return;
    }

    const customOrderInput = document.getElementById('custom-order-input');
    const customOrder = customOrderInput ? customOrderInput.value.trim() : "";
    
    const rows = document.querySelectorAll('.item-row');
    let cartItems = [];
    
    rows.forEach(row => {
      const qty = parseInt(row.querySelector('.qty-display').innerText);
      if (qty > 0) {
        const name = row.getAttribute('data-name');
        cartItems.push(`${qty}x ${name}`);
      }
    });
    
    let orderDetails = cartItems.join(", ");

    if (cartItems.length === 0 && customOrder === "") {
      alert("Please select an item or enter a custom request!");
      return;
    }

    const { data, error } = await db.client
      .from('order')
      .insert([{ 
        customer_id: userId, 
        items: orderDetails, 
        custom_request: customOrder 
      }]);

    if (error) {
      alert("Checkout failed: " + error.message);
    } else {
      alert("Order placed successfully! We will contact you soon.");
      window.location.href = "index.html";
    }
  }
}
const cartManager = new CartManager();