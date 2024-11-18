import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Stats.css'

import sourceData from '../../data/sourceData.json'


function Stats() {
  return (
    <div className='stats'>
      
      
      <div className='statsContainer'>

        <div className='statsContainer1'>
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










        <div>

          <div className='BarChartContainer'>
            <Bar
              data={{
                labels: sourceData.map((data) => data.label),
                datasets: [
                  {
                    label: 'จำนวนเข้าชม',
                    data: sourceData.map((data) => data.value),
                    backgroundColor: [
                      'red', 'green', 'blue'
                    ]
                  }]
              }} />

          </div>
        </div>
      </div>
      <div className='DoughnutChartBg'>

        <div className='DoughnutChartContainer'>
          <Doughnut
            data={{
              labels: sourceData.map((data) => data.label),
              datasets: [
                {
                  label: 'จำนวนเข้าชม',
                  data: sourceData.map((data) => data.value),
                  backgroundColor: [
                    'red', 'green', 'blue'
                  ]
                }
              ]
            }}
          />
        </div>
      </div>

    </div>
  )
}

export default Stats