// --- SUPABASE CONFIG ---
const supabaseUrl = 'https://zwjwewuiqlhiwxndvxij.supabase.co';
const supabaseKey = 'sb_publishable_pBtHBqw1Kj_XTsRobi7LkA_aP9rZjQm'; 
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- 2. ELEMENTS ---
const authContainer = document.getElementById('auth-container');
const appContent = document.getElementById('app-content');
const authBtn = document.getElementById('auth-btn');
const toggleAuth = document.getElementById('toggle-auth');
const firstNameInput = document.getElementById('first-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

let isSignUpMode = true;

// --- 3. AUTH LOGIC ---

toggleAuth.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    document.getElementById('form-title').innerText = isSignUpMode ? 'Join Our App' : 'Welcome Back';
    authBtn.innerText = isSignUpMode ? 'Sign Up' : 'Log In';
    toggleAuth.innerHTML = isSignUpMode ? 
        'Already have an account? <span>Log In</span>' : 
        'Need an account? <span>Sign Up</span>';
    
    firstNameInput.style.display = isSignUpMode ? 'block' : 'none';
});

authBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const firstName = firstNameInput.value;

    if (isSignUpMode) {
        // SIGN UP
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { first_name: firstName } }
        });

        if (error) {
            alert(error.message);
        } else {
            // Store just First Name in your table
            const { error: tableError } = await supabase
                .from('profiles')
                .insert([{ id: data.user.id, first_name: firstName }]);

            if (tableError) console.error(tableError);
            alert("Account created! Now toggle to Log In.");
        }
    } else {
        // LOG IN
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert(error.message);
        } else {
            const name = data.user.user_metadata.first_name || "Friend";
            startApp(name);
        }
    }
});

function startApp(name) {
    authContainer.style.display = 'none';
    appContent.style.display = 'flex';
    document.getElementById('welcome-msg').innerText = `Hi ${name}!`;
}

// --- 4. HEART LOGIC ---
document.getElementById('love-button').addEventListener('click', () => {
    document.getElementById('message').style.opacity = '1';
    for (let i = 0; i < 15; i++) createHeart();
});

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = '50%';
    heart.style.top = '50%';
    const randomX = (Math.random() - 0.5) * 300; 
    heart.style.setProperty('--dx', `${randomX}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
}