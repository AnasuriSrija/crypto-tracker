import { useContext, useEffect, useState } from 'react'
import './Coin.css'
import { useParams } from 'react-router-dom'
import { CoinContext } from '../context/CoinContext'
import LineChart from '../components/Charts/LineChart'

interface CoinDetail {
  image: { large: string };
  name: string;
  symbol: string;
  market_cap_rank: number;
  market_data: {
    current_price: { [key: string]: number };
    market_cap: { [key: string]: number };
    high_24h: { [key: string]: number };
    low_24h: { [key: string]: number };
  };
  description: { en: string };
}

interface HistoricalData {
    prices: [number, number][]; 
}

const Coin = () => {

  const { coinId } = useParams<{ coinId: string }>(); 
  const { allCurrency } = useContext(CoinContext)!;
  
  const [coinData, setCoinData] = useState<CoinDetail | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);

  const fetchCoinData = async () => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      console.error(err);
    }
  }

  const fetchHistoricalData = async () => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${allCurrency.name}&days=10&interval=daily`, options);
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if(coinId) {
        fetchCoinData();
        fetchHistoricalData();
    }
  }, [allCurrency, coinId]) 

  if (coinData && historicalData) {
    return (
      <div className='coin'>
        <div className="coin-name">
          <img src={coinData.image.large} alt={coinData.name} loading="lazy" />
          <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
        </div>
        <div className="coin-chart">
          <LineChart historicalData={historicalData} />
        </div>

        <div className="coin-info">
          <div className="coin-info-row">
            <p>Crypto Market Rank</p>
            <p>{coinData.market_cap_rank}</p>
          </div>
          <div className="coin-info-row">
            <p>Current Price</p>
            <p>{allCurrency.symbol} {coinData.market_data.current_price[allCurrency.name].toLocaleString()}</p>
          </div>
          <div className="coin-info-row">
            <p>Market Cap</p>
            <p>{allCurrency.symbol} {coinData.market_data.market_cap[allCurrency.name].toLocaleString()}</p>
          </div>
          <div className="coin-info-row">
            <p>24 Hour High</p>
            <p>{allCurrency.symbol} {coinData.market_data.high_24h[allCurrency.name].toLocaleString()}</p>
          </div>
          <div className="coin-info-row">
            <p>24 Hour Low</p>
            <p>{allCurrency.symbol} {coinData.market_data.low_24h[allCurrency.name].toLocaleString()}</p>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='spinner'>
        <div className="spin"></div>
      </div>
    )
  }
}

export default Coin;