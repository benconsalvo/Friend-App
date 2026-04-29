// --- 1. SUPABASE CONFIG ---
// We use 'mySupabase' to avoid name conflicts with the library
const supabaseUrl = 'https://zwjwewuiqlhiwxndvxij.supabase.co';
const supabaseKey = 'sb_publishable_pBtHBqw1Kj_XTsRobi7LkA_aP9rZjQm'; 
const mySupabase = supabase.createClient(supabaseUrl, supabaseKey);

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

// Toggle between Login and Sign Up
toggleAuth.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    document.getElementById('form-title').innerText = isSignUpMode ? 'Join Our App' : 'Welcome Back';
    authBtn.innerText = isSignUpMode ? 'Sign Up' : 'Log In';
    toggleAuth.innerHTML = isSignUpMode ? 
        'Already have an account? <span>Log In</span>' : 
        'Need an account? <span>Sign Up</span>';
    
    // Hide name field if logging in
    firstNameInput.style.display = isSignUpMode ? 'block' : 'none';
});

// Handle Button Click
authBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const firstName = firstNameInput.value;

    if (isSignUpMode) {
        // --- SIGN UP PROCESS ---
        const { data, error } = await mySupabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { first_name: firstName }
            }
        });

        if (error) {
            alert("Sign Up Error: " + error.message);
        } else if (data.user) {
            // INSERT INTO YOUR PROFILES TABLE
            const { error: tableError } = await mySupabase
                .from('profiles')
                .insert([
                    { id: data.user.id, first_name: firstName }
                ]);

            if (tableError) {
                console.error("Table Error:", tableError.message);
            }
            alert("Success! You can now toggle to 'Log In'.");
        }
    } else {
        // --- LOG IN PROCESS ---
        const { data, error } = await mySupabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert("Login failed: " + error.message);
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

// --- 4. HEART BURST LOGIC ---

document.getElementById('love-button').addEventListener('click', function() {
    const message = document.getElementById('message');
    message.style.opacity = '1';

    for (let i = 0; i < 15; i++) {
        createHeart();
    }
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

    setTimeout(() => {
        heart.remove();
    }, 1500);
}