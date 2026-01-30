// personal_chef/src/components/Header.jsx
import chefClaudeLogo from '../assets/chef-claude-icon.png';

export default function Header() {
    return (
        <header className="header">
            {/* These are the background flying elements */}
            <div className="flying-icons">
                <span>🥘</span><span>🍕</span><span>🍔</span><span>🥗</span>
                <span>🍜</span><span>🍳</span><span>🍱</span><span>🌮</span>
            </div>
            
            <div className="header-content">
                <img 
                    src={chefClaudeLogo} 
                    className="chef-logo" 
                    alt="Chef Zubair Logo" 
                />
                <h1>Chef Zubair</h1>
            </div>
        </header>
    );
}