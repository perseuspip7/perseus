// User data generation and management
class LeaderboardApp {
    constructor() {
        this.showAllUsers = false;
        this.allUsers = this.generateUsers();
        this.topUsers = this.allUsers.slice(0, 3);
        this.top10Users = this.allUsers.slice(0, 10);
        this.otherUsers = this.allUsers.slice(10);
        
        this.init();
    }

    generateUsers() {
        const names = [
            "Alex Johnson", "Sarah Chen", "Mike Rodriguez", "Emma Davis", "James Wilson",
            "Lisa Thompson", "David Brown", "Anna Garcia", "John Smith", "Maria Lopez",
            "Robert Taylor", "Jennifer Kim", "Michael Zhang", "Amy Wilson", "Chris Lee",
            "Jessica Wang", "Daniel Miller", "Ashley Jones", "Ryan Davis", "Michelle Liu",
            "Kevin White", "Rachel Green", "Steven Clark", "Laura Martinez", "Brian Chen",
            "Nicole Brown", "Jason Park", "Stephanie Lee", "Andrew Kim", "Melissa Wong",
            "Joshua Garcia", "Amanda Johnson", "Nicholas Rodriguez", "Samantha Davis",
            "Tyler Wilson", "Christina Lee", "Jacob Martinez", "Monica Chen", "Ethan Brown",
            "Kayla Johnson", "Nathan Smith", "Brittany Kim", "Caleb Wilson", "Victoria Lee",
            "Ian Rodriguez", "Danielle Chen", "Sean Garcia", "Megan Johnson", "Austin Brown",
            "Jasmine Kim", "Cameron Wilson", "Alexis Lee", "Hunter Rodriguez", "Sydney Chen",
            "Tristan Garcia", "Destiny Johnson", "Blake Brown", "Paige Kim", "Garrett Wilson",
            "Haley Lee", "Trevor Rodriguez", "Mackenzie Chen", "Jared Garcia", "Taylor Johnson",
            "Cole Brown", "Brooke Kim", "Lucas Wilson", "Morgan Lee", "Mason Rodriguez",
            "Kaylee Chen", "Logan Garcia", "Savannah Johnson", "Jackson Brown", "Chloe Kim",
            "Connor Wilson", "Grace Lee", "Owen Rodriguez", "Zoe Chen", "Carter Garcia",
            "Lily Johnson", "Wyatt Brown", "Ava Kim", "Landon Wilson", "Sophia Lee",
            "Gavin Rodriguez", "Emma Chen", "Brayden Garcia", "Olivia Johnson", "Nolan Brown",
            "Isabella Kim", "Ryder Wilson", "Mia Lee", "Grayson Rodriguez", "Charlotte Chen",
            "Jaxon Garcia", "Abigail Johnson", "Easton Brown", "Emily Kim", "Colton Wilson",
            "Madison Lee", "Braxton Rodriguez", "Elizabeth Chen", "Declan Garcia", "Avery Johnson",
            "Liam Brown", "Sofia Kim", "Hudson Wilson", "Camila Lee", "Parker Rodriguez"
        ];

        return names.map((name, index) => ({
            id: index + 1,
            name,
            score: 3000 - (index * 15) - Math.floor(Math.random() * 20),
            rank: index + 1
        }));
    }

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    formatScore(score) {
        return score.toLocaleString();
    }

    init() {
        this.updateTopThree();
        this.renderTopTen();
        this.renderUsersList();
        this.setupEventListeners();
        this.updateCounts();
    }

    updateTopThree() {
        // Update first place
        document.getElementById('first-name').textContent = this.topUsers[0].name;
        document.getElementById('first-score').textContent = this.formatScore(this.topUsers[0].score);
        document.getElementById('first-initials').textContent = this.getInitials(this.topUsers[0].name);

        // Update second place
        document.getElementById('second-name').textContent = this.topUsers[1].name;
        document.getElementById('second-score').textContent = this.formatScore(this.topUsers[1].score);
        document.getElementById('second-initials').textContent = this.getInitials(this.topUsers[1].name);

        // Update third place
        document.getElementById('third-name').textContent = this.topUsers[2].name;
        document.getElementById('third-score').textContent = this.formatScore(this.topUsers[2].score);
        document.getElementById('third-initials').textContent = this.getInitials(this.topUsers[2].name);
    }

    renderTopTen() {
        const topTenList = document.getElementById('top-ten-list');
        const topTenUsers = this.top10Users.slice(3); // Skip first 3 since they're in podium
        
        topTenList.innerHTML = topTenUsers.map(user => `
            <div class="top-ten-item">
                <div class="top-ten-left">
                    <div class="rank-badge">${user.rank}</div>
                    <div class="top-ten-avatar">
                        ${this.getInitials(user.name)}
                    </div>
                    <div class="top-ten-user-info">
                        <h4>${user.name}</h4>
                        <p>Rank #${user.rank}</p>
                    </div>
                </div>
                <div class="top-ten-score">
                    <p>${this.formatScore(user.score)}</p>
                    <p>points</p>
                </div>
            </div>
        `).join('');
    }

    renderUsersList() {
        const usersList = document.getElementById('users-list');
        const usersToShow = this.showAllUsers ? this.otherUsers : this.otherUsers.slice(0, 10);
        
        usersList.innerHTML = usersToShow.map(user => `
            <div class="user-item">
                <div class="user-item-left">
                    <div class="user-rank">${user.rank}</div>
                    <div class="user-avatar">
                        ${this.getInitials(user.name)}
                    </div>
                    <div class="user-details">
                        <h4>${user.name}</h4>
                        <p>Rank #${user.rank}</p>
                    </div>
                </div>
                <div class="user-score-info">
                    <p>${this.formatScore(user.score)}</p>
                    <p>points</p>
                </div>
            </div>
        `).join('');

        // Update show more section visibility
        const showMoreSection = document.getElementById('show-more-section');
        if (!this.showAllUsers && this.otherUsers.length > 10) {
            showMoreSection.classList.remove('hidden');
        } else {
            showMoreSection.classList.add('hidden');
        }
    }

    setupEventListeners() {
        const toggleButton = document.getElementById('toggle-users-btn');
        const showMoreButton = document.getElementById('show-more-btn');
        
        toggleButton.addEventListener('click', () => {
            this.toggleAllUsers();
        });

        showMoreButton.addEventListener('click', () => {
            this.showAllUsers = true;
            this.renderUsersList();
            this.updateToggleButton();
        });
    }

    toggleAllUsers() {
        this.showAllUsers = !this.showAllUsers;
        this.renderUsersList();
        this.updateToggleButton();
    }

    updateToggleButton() {
        const toggleText = document.getElementById('toggle-text');
        const chevronIcon = document.getElementById('chevron-icon');
        
        if (this.showAllUsers) {
            toggleText.innerHTML = `
                <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m18 15-6-6-6 6"/>
                </svg>
                Show Less
            `;
        } else {
            toggleText.innerHTML = `
                <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
                Show All (${this.otherUsers.length})
            `;
        }
    }

    updateCounts() {
        document.getElementById('total-users').textContent = this.otherUsers.length;
        document.getElementById('remaining-count').textContent = this.otherUsers.length - 10;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LeaderboardApp();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to podium cards
    const podiumCards = document.querySelectorAll('.podium-card');
    podiumCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = card.classList.contains('first-place') ? 'scale(1.15)' : 'scale(1.05)';
            card.style.transition = 'transform 0.2s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = card.classList.contains('first-place') ? 'scale(1.1)' : 'scale(1)';
        });
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Add scroll-to-top functionality when clicking on crown
    const crownImage = document.querySelector('.crown-image');
    if (crownImage) {
        crownImage.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        crownImage.style.cursor = 'pointer';
    }
});