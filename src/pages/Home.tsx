import { Link } from 'react-router-dom';
import { useContext, useEffect, useState, useMemo, useRef } from 'react'; // <--- 1. Import useRef
import { CoinContext, type Coin } from '../context/CoinContext'; 
import { useDebounce } from '../hooks/useDebounce';
import TableSkeleton from '../components/Skeleton/TableSkeleton';
import './Home.css';

const Home = () => {
    const { allCoins, allCurrency, watchlist, toggleWatchlist, page, setPage } = useContext(CoinContext)!;
    const tableRef = useRef<HTMLDivElement>(null);

    const [input, setInput] = useState<string>('');
    const [topGainer, setTopGainer] = useState<Coin | null>(null);
    const [topLoser, setTopLoser] = useState<Coin | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const debouncedSearchTerm = useDebounce(input, 500);

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    }

    const paginationHandler = (selectedPage: number) => {
        if (selectedPage >= 1) {
            setPage(selectedPage);
            if (tableRef.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    const displayCoins = useMemo(() => {
        let coins = allCoins;
        if (showFavoritesOnly) coins = coins.filter(coin => watchlist.includes(coin.id));
        if (debouncedSearchTerm) coins = coins.filter((item) => item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
        return coins;
    }, [allCoins, debouncedSearchTerm, showFavoritesOnly, watchlist]);

    useEffect(() => {
        if (allCoins.length > 0 && page === 1 && !debouncedSearchTerm && !showFavoritesOnly) {
            const sortedByChange = [...allCoins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
            setTopGainer(sortedByChange[0]); 
            setTopLoser(sortedByChange[sortedByChange.length - 1]); 
        }
    }, [allCoins, page, debouncedSearchTerm, showFavoritesOnly]);

    return (
        <div className='home'>
            <div className='heading'>
                <h1>Crypto Marketplace</h1>
                <p>Explore live prices, trends, and top coins. Sign in to unlock the full dashboard.</p>
                
                {topGainer && topLoser && !showFavoritesOnly && !debouncedSearchTerm && (
                    <div className="highlights-container">
                         <div className="highlight-card gainer-card">
                            <div className="card-header">
                                <p>Top Gainer</p>
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
                                <p>Top Loser</p>
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
                                <p>Market Leader</p>
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
        
                <div className="search-controls">
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
                    <button 
                        className={`fav-filter-btn ${showFavoritesOnly ? 'active' : ''}`}
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    >
                        {showFavoritesOnly ? 'Show All' : '★ Favorites'}
                    </button>
                </div>
            </div>

            {allCoins.length === 0 ? (
                <TableSkeleton />
            ) : (
                <div className='crypto-table' ref={tableRef}>
                    <table>
                        <thead>
                            <tr> 
                                <th>#</th>
                                <th>Coins</th>
                                <th>Price</th>
                                <th>24h Change</th>
                                <th style={{textAlign: 'right'}}>Market Cap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayCoins.length > 0 ? (
                                displayCoins.map((item, index) => {
                                    const isFav = watchlist.includes(item.id);
                                    return (
                                        <tr key={index} className="table-row">
                                            <td 
                                                onClick={(e) => {
                                                    e.preventDefault(); 
                                                    toggleWatchlist(item.id);
                                                }}
                                                style={{cursor: 'pointer', minWidth: '60px'}}
                                                title="Add to Watchlist"
                                            >
                                                <span style={{ color: isFav ? '#FFD700' : '#444', fontSize: '18px', marginRight: '5px' }}>
                                                    {isFav ? '★' : '☆'}
                                                </span> 
                                                {item.market_cap_rank}
                                            </td>
                                            <td>
                                                <Link to={`/coin/${item.id}`} className="coin-name-link">
                                                    <img src={item.image} alt={item.name} className="coin-logo" style={{width: '35px'}} loading="lazy" />
                                                    <p>{item.name} - {item.symbol.toUpperCase()}</p>
                                                </Link>
                                            </td>
                                            <td>{allCurrency.symbol} {item.current_price.toLocaleString()}</td>
                                            <td className={item.price_change_percentage_24h > 0 ? "green" : "red"} style={{textAlign: "center"}}>
                                                {Math.floor(item.price_change_percentage_24h * 100) / 100}%
                                            </td>
                                            <td style={{textAlign: "right"}}>{allCurrency.symbol} {item.market_cap.toLocaleString()}</td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{textAlign: "center", padding: "30px"}}>
                                        No coins found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {!showFavoritesOnly && !debouncedSearchTerm && (
                        <div className="pagination">
                            <button 
                                onClick={() => paginationHandler(page - 1)} 
                                style={{ visibility: page === 1 ? 'hidden' : 'visible' }}
                            >
                                ← Previous
                            </button>
                            <span className="page-number">Page {page}</span>
                            <button onClick={() => paginationHandler(page + 1)}>
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Home;