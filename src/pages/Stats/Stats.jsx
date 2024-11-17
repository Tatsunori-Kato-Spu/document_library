import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Stats.css'

import sourceData from '../../data/sourceData.json'


function Stats() {
  return (
    <div>
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
              }
            ]
          }

          }
        />
      </div>

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
          }

          }
        />
      </div>

    </div>
  )
}

export default Stats