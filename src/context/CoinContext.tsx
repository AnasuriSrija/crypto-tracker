import { createContext, useState, useEffect, type ReactNode } from 'react';

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

interface Currency {
  name: string;
  symbol: string;
}

interface CoinContextType {
  allCoins: Coin[];
  allCurrency: Currency;
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  watchlist: string[];
  toggleWatchlist: (coinId: string) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const CoinContext = createContext<CoinContextType | null>(null);

interface CoinContextProviderProps {
  children: ReactNode;
}

const CoinContextProvider = (props: CoinContextProviderProps) => {

    const [allCoins, setAllCoins] = useState<Coin[]>([]);
    const [allCurrency, setCurrency] = useState<Currency>({
        name: 'usd',
        symbol: '$'
    });
    const [page, setPage] = useState<number>(1);

    // Initialize Watchlist from Local Storage
    const [watchlist, setWatchlist] = useState<string[]>(() => {
        const saved = localStorage.getItem('watchlist');
        return saved ? JSON.parse(saved) : [];
    });

    // Save Watchlist to Local Storage whenever it changes
    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    const toggleWatchlist = (coinId: string) => {
        setWatchlist((prev) => {
            if (prev.includes(coinId)) {
                return prev.filter(id => id !== coinId);
            } else {
                return [...prev, coinId];
            }
        });
    };

    const fetchCoins = async () => {
        const options = {
            method: 'GET', 
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': 'CG-nsdxHMDNx1ockqYQndRipM5R'
            }
        };

        try {
            // Using page state in URL and asking for 10 items per page
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${allCurrency.name}&order=market_cap_desc&per_page=10&page=${page}&sparkline=false&price_change_percentage=1h%2C24h`, 
                options
            );
            
            const data = await response.json();
            setAllCoins(data);
        } catch (err) {
            console.error("Failed to fetch coins:", err);
        }
    }

    // Re-fetch when currency OR page changes
    useEffect(() => {
        fetchCoins();
    }, [allCurrency, page]);

    const contextValue: CoinContextType = {
        allCoins,
        allCurrency,
        setCurrency,
        watchlist,
        toggleWatchlist,
        page,
        setPage
    }

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    )
}

export default CoinContextProvider;