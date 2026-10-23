class AuthManager {
  constructor() {
    this.isLoginMode = false;
  }

  setAuthMode(mode) {
    const nameInput = document.getElementById('nameInput');
    const addressInput = document.getElementById('addressInput');
    const toggleSignup = document.getElementById('toggle-signup');
    const toggleLogin = document.getElementById('toggle-login');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');

    if (mode === 'login') {
      this.isLoginMode = true;
      nameInput.style.display = 'none';
      nameInput.removeAttribute('required');
      addressInput.style.display = 'none';
      addressInput.removeAttribute('required');
      
      toggleSignup.classList.remove('active');
      toggleLogin.classList.add('active');
      
      formTitle.innerText = "Welcome Back";
      submitBtn.innerText = "Log In";
    } else {
      this.isLoginMode = false;
      nameInput.style.display = 'block';
      nameInput.setAttribute('required', 'true');
      addressInput.style.display = 'block';
      addressInput.setAttribute('required', 'true');
      
      toggleSignup.classList.add('active');
      toggleLogin.classList.remove('active');
      
      formTitle.innerText = "Sign Up";
      submitBtn.innerText = "Stick It!";
    }
  }

  async handleAuth(event) {
    event.preventDefault();
    if (this.isLoginMode) {
      await this.loginUser();
    } else {
      await this.signUpUser();
    }
  }

  async signUpUser() {
    const userName = document.getElementById('nameInput').value.trim();
    const userPhone = document.getElementById('phoneInput').value.trim();
    const userPassword = document.getElementById('passwordInput').value;
    const userAddress = document.getElementById('addressInput').value.trim();

    if (!userName || !userPhone || !userPassword || !userAddress) {
      alert("Please fill out all fields.");
      return;
    }
    if (userPhone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return; 
    }
    if (userPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    
    const { data, error } = await db.client
      .from('customers')
      .insert([{ name: userName, phone: userPhone, password: userPassword, address: userAddress }])
      .select();
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Account created! Welcome to Navrang.");
      localStorage.setItem("navrang_user", data?.[0]?.id || userPhone);
      window.location.href = "index.html";
    }
  }

  async loginUser() {
    const userPhone = document.getElementById('phoneInput').value.trim();
    const userPassword = document.getElementById('passwordInput').value;

    if (!userPhone || !userPassword) {
      alert("Please enter both phone and password.");
      return;
    }

    const { data, error } = await db.client
      .from('customers')
      .select('*')
      .eq('phone', userPhone)
      .eq('password', userPassword);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    if (data.length === 0) {
      alert("Incorrect phone number or password.");
      return;
    }

    alert("Welcome back!");
    localStorage.setItem("navrang_user", data?.[0]?.id || userPhone);
    window.location.href = "index.html";
  }
}
const authManager = new AuthManager();