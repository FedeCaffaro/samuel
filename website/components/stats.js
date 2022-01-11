import React from 'react'

const Header = (props) => {
  const { stakesCount, stakingRewards, balanceTokens, percentageStaked,stakesCount1,stakesCount2} = props
  return (
	  <div className="stats">
      <div className="stat">
        <div className="stat-number">{stakesCount}</div>
        <div className="stat-label">staked nfts</div>
      </div>
      <div className="stat">
        <div className="stat-number">{stakingRewards}</div>
        <div className="stat-label">Claimable Tokens</div>
      </div>
      <div className="stat">
        <div className="stat-number">{balanceTokens}</div>
        <div className="stat-label"> Token Balance</div>
      </div>
      <div className="stat">
        <div className="stat-number">{percentageStaked}</div>
        <div className="stat-label"> % Staked </div>
      </div>
    </div>
  )
}

export default Header