import { Link } from 'react-router-dom';
import { useContext, useEffect, useState, useMemo } from 'react';
import { CoinContext, type Coin } from '../context/CoinContext'; 
import { useDebounce } from '../hooks/useDebounce';
import TableSkeleton from '../components/Skeleton/TableSkeleton';
import './Home.css';

const Home = () => {
    const { allCoins, allCurrency } = useContext(CoinContext)!;
    
    // Local state for UI
    const [input, setInput] = useState<string>('');
    const [topGainer, setTopGainer] = useState<Coin | null>(null);
    const [topLoser, setTopLoser] = useState<Coin | null>(null);

    // 1. OPTIMIZATION: Debounce the search term (wait 500ms)
    const debouncedSearchTerm = useDebounce(input, 500);

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    }

    // 2. OPTIMIZATION: Memoize the filtering logic
    // This prevents re-calculation on every render unless search or coins change
    const displayCoins = useMemo(() => {
        if (!debouncedSearchTerm) return allCoins;
        return allCoins.filter((item) => 
            item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [allCoins, debouncedSearchTerm]);

    // Calculate Highlights logic
    useEffect(() => {
        if (allCoins.length > 0) {
            const sortedByChange = [...allCoins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
            setTopGainer(sortedByChange[0]); 
            setTopLoser(sortedByChange[sortedByChange.length - 1]); 
        }
    }, [allCoins]);

    return (
        <div className='home'>
            <div className='heading'>
                <h1>Crypto Marketplace</h1>
                <p>Explore live prices, trends, and top coins. Sign in to unlock the full dashboard.</p>
                
                {/* Only show highlights if data exists */}
                {topGainer && topLoser && (
                    <div className="highlights-container">
                        <div className="highlight-card gainer-card">
                            <div className="card-header">
                                <p>🚀 Top Gainer</p>
                                <span className="green">+{topGainer.price_change_percentage_24h.toFixed(2)}%</span>
                            </div>
                            <div className="card-info">
                                <img src={topGainer.image} alt={topGainer.name} />
                                <div>
                                    <h4>{topGainer.name}</h4>
                                    <p>{allCurrency.symbol}{topGainer.current_price.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="highlight-card loser-card">
                            <div className="card-header">
                                <p>📉 Top Loser</p>
                                <span className="red">{topLoser.price_change_percentage_24h.toFixed(2)}%</span>
                            </div>
                            <div className="card-info">
                                <img src={topLoser.image} alt={topLoser.name} />
                                <div>
                                    <h4>{topLoser.name}</h4>
                                    <p>{allCurrency.symbol}{topLoser.current_price.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                         <div className="highlight-card cap-card">
                            <div className="card-header">
                                <p>💎 Market Leader</p>
                                <span className="blue">#1 Rank</span>
                            </div>
                            {allCoins[0] && (
                                <div className="card-info">
                                    <img src={allCoins[0].image} alt={allCoins[0].name} />
                                    <div>
                                        <h4>{allCoins[0].name}</h4>
                                        <p>{allCurrency.symbol}{allCoins[0].market_cap.toLocaleString().slice(0,4)} B</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
        
                <form className='search-bar' onSubmit={(e) => e.preventDefault()}>
                    <input 
                        className='search-bar-input' 
                        type='text' 
                        placeholder='Search for crypto...' 
                        onChange={inputHandler}
                        value={input}
                        list='coinlist' 
                    />
                    <datalist id='coinlist'>
                        {allCoins.map((item, index) => (<option key={index} value={item.name} />))}
                    </datalist>
                    <button className='search-btn' type='submit'>Search</button>
                </form>
            </div>

            {/* 3. OPTIMIZATION: Show Skeleton if loading */}
            {allCoins.length === 0 ? (
                <TableSkeleton />
            ) : (
                <div className='crypto-table'>
                    <table>
                        <thead>
                            <tr> 
                                <th>#</th>
                                <th>Coins</th>
                                <th>Price</th>
                                <th>24h Change</th>
                                <th>Market Cap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayCoins.slice(0, 10).map((item, index) => (
                                <tr key={index} className="table-row">
                                    <td>{item.market_cap_rank}</td>
                                    <td>
                                        <Link to={`/coin/${item.id}`} className="coin-name-link">
                                            {/* 4. OPTIMIZATION: Lazy load images */}
                                            <img src={item.image} alt={item.name} className="coin-logo" style={{width: '35px'}} loading="lazy" />
                                            <p>{item.name} - {item.symbol.toUpperCase()}</p>
                                        </Link>
                                    </td>
                                    <td>{allCurrency.symbol} {item.current_price.toLocaleString()}</td>
                                    <td className={item.price_change_percentage_24h > 0 ? "green" : "red"} style={{textAlign: "right"}}>
                                        {Math.floor(item.price_change_percentage_24h * 100) / 100}%
                                    </td>
                                    <td style={{textAlign: "right"}}>{allCurrency.symbol} {item.market_cap.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Home;