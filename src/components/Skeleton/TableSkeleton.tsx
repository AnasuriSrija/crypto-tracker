import './TableSkeleton.css';

const TableSkeleton = () => {
  const skeletonRows = Array(10).fill(0);

  return (
    <div className="crypto-table">
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
          {skeletonRows.map((_, index) => (
            <tr key={index} className="skeleton-row">
              <td><div className="skeleton-box sm"></div></td>
              <td>
                <div className="coin-name-link">
                    <div className="skeleton-circle"></div>
                    <div className="skeleton-box md"></div>
                </div>
              </td>
              <td><div className="skeleton-box md"></div></td>
              <td><div className="skeleton-box sm"></div></td>
              <td><div className="skeleton-box lg"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;