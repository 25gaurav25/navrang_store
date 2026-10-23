class SessionManager {
  constructor() {
    this.user = localStorage.getItem("navrang_user");
    this.authLinks = [document.getElementById("auth-link"), document.getElementById("auth-link-mobile")];
    this.init();
  }

  init() {
    if (this.user) {
      this.authLinks.forEach(link => {
        if (link) {
          link.innerHTML = `<span class="icon">logout</span>`;
          if (link.id === 'auth-link') link.innerText = "Logout";
          link.style.color = "red"; 
          link.onclick = (e) => this.logout(e);
        }
      });
    }
  }

  logout(event) {
    event.preventDefault(); 
    localStorage.removeItem("navrang_user"); 
    window.location.reload(); 
  }
}
const session = new SessionManager();