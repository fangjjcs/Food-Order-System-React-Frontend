

import './OrderDialogContent.css';

const ResultDialogContent = ({item, children}) => {
  return (
    <div className='result-dialog-box'>
        <div className='result-info-box'>
            <div className='result-info'>總價 $ {item.orderTotalPrice}</div>
            <div className='result-info count'>({item.orderCount} 份餐點)</div>
        </div>
        {children}
    </div>
  )
}

export default ResultDialogContent