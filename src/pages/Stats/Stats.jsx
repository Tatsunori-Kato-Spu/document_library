import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Stats.css'
import { docdata } from '../../data/docdata';




function Stats() {
  const departmentStats = docdata.reduce((acc, doc) => {
    const department = doc['roles'];
    if (!acc[department]) {
      acc[department] = 0;
    }
    acc[department]++;
    return acc;
  }, {});

  // Prepare the data for the charts
  const departments = Object.keys(departmentStats);
  const departmentValues = Object.values(departmentStats);

  return (
    <div className='stats'>


      <div className='statsContainer'>

        <div>
          <div className='statsContainer'>
            {/* Static document count boxes */}
            <div className='statsContainer1'>
              {departments.map((department, index) => (
                <div key={index} className='boxStats'>
                  <div className='textStatsTopic'>{`จำนวนเอกสารใน ${department}`}</div>
                  <div className='textStatsNum'>{departmentValues[index]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Bar Chart */}
          <div className='BarChartContainer'>
            <Bar
              data={{
                labels: departments,
                datasets: [
                  {
                    label: 'จำนวนเอกสารแต่ละแผนก',
                    data: departmentValues,
                    backgroundColor: [
                      'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'brown', 'pink'
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>

      <div >
        {/* Doughnut Chart */}
        <div className='DoughnutChartBg'>
          <div className='DoughnutChartContainer'>
            <Doughnut
              data={{
                labels: departments,
                datasets: [
                  {
                    label: 'จำนวนเอกสารแต่ละแผนก',
                    data: departmentValues,
                    backgroundColor: [
                      'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'brown', 'pink'
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats