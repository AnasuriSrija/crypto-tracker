import { Link, useLocation, useNavigate } from 'react-router-dom' // <--- Added hooks
import './NavBar.css';
import Logo from '../../assets/logo.png';
import { useContext } from 'react';
import { CoinContext } from '../../context/CoinContext';

const NavBar = () => {

    const { setCurrency } = useContext(CoinContext)!;
    
    // 1. Hooks to track location and handle navigation
    const location = useLocation();
    const navigate = useNavigate();

    const currencyHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        switch (event.target.value) {
            case "usd": {
                setCurrency({name: 'usd', symbol: '$'});
                break;
            }
            case "eur": {
                setCurrency({name: 'eur', symbol: '€'});
                break;
            }
            case "inr": {
                setCurrency({name: 'inr', symbol: '₹'});
                break;
            }
            case "gbp": {
                setCurrency({name: 'gbp', symbol: '£'});
                break;
            }
            case "jpy": {
                setCurrency({name: 'jpy', symbol: '¥'});
                break;
            }
            case "aud": {
                setCurrency({name: 'aud', symbol: 'A$'});
                break;
            }
            case "cad": {
                setCurrency({name: 'cad', symbol: 'C$'});
                break;
            }
            default : {
                setCurrency({name: 'usd', symbol: '$'});
                break;
            }
        }
    }

    return (
        <div className='nav-bar'>
            <div className='logo-container'>
                <Link to={'/'}>
                    <img className='logo' src={Logo} alt="logo" />
                </Link>
                <p>Crypto Tracker</p>
            </div>
            
            <div className='nav-right'>
                {location.pathname !== '/' && (
                    <button onClick={() => navigate('/')} className='back-btn'>
                        Back
                    </button>
                )}

                <select className='curr-type' onChange={currencyHandler}>
                    <option value='usd'>USD ($)</option>
                    <option value='eur'>EUR (€)</option>
                    <option value='inr'>INR (₹)</option>
                    <option value='gbp'>GBP (£)</option>
                    <option value='jpy'>JPY (¥)</option>
                    <option value='aud'>AUD (A$)</option>
                    <option value='cad'>CAD (C$)</option>
                </select>
            </div>
        </div>
    )
}

export default NavBar;