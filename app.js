// --- 1. SUPABASE CONFIG ---
const supabaseUrl = 'https://zwjwewuiqlhiwxndvxij.supabase.co';
const supabaseKey = 'sb_publishable_pBtHBqw1Kj_XTsRobi7LkA_aP9rZjQm'; 
const mySupabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- 2. ELEMENTS ---
const authContainer = document.getElementById('auth-container');
const appContent = document.getElementById('app-content');
const authBtn = document.getElementById('auth-btn');
const toggleAuth = document.getElementById('toggle-auth');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const userSearch = document.getElementById('user-search');
const searchResults = document.getElementById('search-results');

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
    lastNameInput.style.display = isSignUpMode ? 'block' : 'none';
});

authBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;

    if (isSignUpMode) {
        const { data, error } = await mySupabase.auth.signUp({
            email, password,
            options: { data: { first_name: firstName, last_name: lastName } }
        });

        if (error) {
            alert(error.message);
        } else if (data.user) {
            await mySupabase.from('users').insert([
                { id: data.user.id, first_name: firstName, last_name: lastName }
            ]);
            startApp(firstName, lastName);
        }
    } else {
        const { data, error } = await mySupabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert(error.message);
        } else {
            startApp(data.user.user_metadata.first_name, data.user.user_metadata.last_name);
        }
    }
});

function startApp(first, last) {
    authContainer.style.display = 'none';
    appContent.style.display = 'flex';
    document.getElementById('welcome-msg').innerText = `Hi ${first} ${last}!`;
}

// --- 4. FRIEND SEARCH & ADD LOGIC ---

userSearch.addEventListener('input', async (e) => {
    const term = e.target.value.trim();
    if (term.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    // Search users by first or last name
    const { data: users, error } = await mySupabase
        .from('users')
        .select('id, first_name, last_name')
        .or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%`)
        .limit(5);

    if (users) {
        searchResults.innerHTML = '';
        users.forEach(u => {
            const div = document.createElement('div');
            div.className = 'search-item';
            div.innerHTML = `
                <span>${u.first_name} ${u.last_name}</span>
                <button class="add-btn" onclick="addFriend('${u.id}')">Add</button>
            `;
            searchResults.appendChild(div);
        });
    }
});

// We attach addFriend to 'window' so the HTML button can see it
window.addFriend = async (friendId) => {
    const { data: { user } } = await mySupabase.auth.getUser();
    
    const { error } = await mySupabase
        .from('friendships')
        .insert([{ user_id: user.id, friend_id: friendId }]);

    if (error) {
        alert("You are already friends or there was an error!");
    } else {
        alert("Friend added!");
    }
};

// --- 5. HEART LOGIC ---
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