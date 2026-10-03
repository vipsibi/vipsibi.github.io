import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">
                <img className="brand-icon" src="/eramika-mark.svg" alt="" />
                <span>ERAMIKA</span>
            </div>

            <nav className="side-nav">
                <NavLink to="/" end>
                    Home
                </NavLink>
                <NavLink to="/hotels">Manage Hotels</NavLink>
                <NavLink to="/hotels/add">Add Hotel</NavLink>
            </nav>

            <button className="logout-btn" type="button">
                Logout
            </button>
        </aside>
    );
}