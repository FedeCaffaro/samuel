import React from 'react'

const Header = (props) => {
  const { stakesCount, stakingRewards} = props
  return (
	  <div className="stats">
      <div className="stat">
        <div className="stat-number">{stakesCount}</div>
        <div className="stat-label">staked nfts</div>
      </div>
      <div className="stat">
        <div className="stat-number">{stakingRewards}</div>
        <div className="stat-label">earned tokens</div>
      </div>
    </div>
  )
}

export default Header