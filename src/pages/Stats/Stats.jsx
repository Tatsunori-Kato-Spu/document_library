import Header from '../../Layout/Header/Header'
import './Stats.css'


function Stats() {
  return(
    <div>
  <Header/>
  <div className='statsContainer'>
  
  <div className='boxStats'>
    <span className='textStatsTopic'>จำนวนเอกสาร</span>
    <span className='textStatsNum'>500</span>
  </div>
  
  
  <div className='boxStats'>
    <span className='textStatsTopic'>จำนวนเอกสาร</span>
    <span className='textStatsNum'>500</span>
  </div>
  
  <div className='boxStats'>
    <span className='textStatsTopic'>จำนวนเอกสาร</span>
    <span className='textStatsNum'>500</span>
  </div>
  
  <div className='boxStats'>
    <span className='textStatsTopic'>จำนวนเอกสาร</span>
    <span className='textStatsNum'>500</span>
  </div>
  
  </div>
  </div>
)
}
  
  export default Stats