import { Chart as ChartJS,ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Stats.css'
import { docdata } from '../../data/docdata';


ChartJS.register(ArcElement, Tooltip, Legend);

function Stats() {

  const totalDocuments = docdata.length;

  const roleCounts = {
    admin: docdata.filter(doc => doc.roles?.includes('admin')).length,
    worker: docdata.filter(doc => doc.roles?.includes('worker')).length,
    guest: docdata.filter(doc => doc.roles?.includes('guest')).length,
  };

  // ข้อมูลสำหรับการแสดงผล
  const departments = ['admin', 'worker', 'guest'];
  const departmentValues = [roleCounts.admin, roleCounts.worker, roleCounts.guest];

  const displayData = [
    { name: 'เอกสารทั้งหมด', value: totalDocuments },
    { name: 'จำนวนเอกสารใน admin', value: roleCounts.admin },
    { name: 'จำนวนเอกสารใน worker', value: roleCounts.worker },
    { name: 'จำนวนเอกสารใน guest', value: roleCounts.guest },
  ];


  const departmentStats = docdata.reduce((acc, doc) => {
    const department = doc['roles'];
    if (!acc[department]) {
      acc[department] = 0;
    }
    acc[department]++;
    return acc;
  }, {});

  // // Prepare the data for the charts
  // const departments = Object.keys(departmentStats);
  // const departmentValues = Object.values(departmentStats);

  return (
    <div className='stats'>


      <div className='statsContainer'>

        <div>
          <div className='statsContainer'>


            {/* Static document count boxes */}
            <div className='statsContainer1'>
              {displayData.map((data, index) => (
                <div key={index} className='boxStats'>
                  <div className='textStatsTopic'>{data.name}</div>
                  <div className='textStatsNum'>{data.value}</div>
                </div>
              ))}
              {/* {departments.map((department, index) => (
                <div key={index} className='boxStats'>
                  <div className='textStatsTopic'>{`จำนวนเอกสารใน ${department}`}</div>
                  <div className='textStatsNum'>{departmentValues[index]}</div>
                </div>
              ))} */}
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
          <div className='DoughnutChartText'>
            <h1 >จำนวนเอกสาร</h1>
          </div>
          <div>

            <Doughnut
              data={{
                labels: departments,
                datasets: [
                  {
                    label: 'จำนวนเอกสารแต่ละแผนก',
                    data: departmentValues,
                    backgroundColor: ['red', 'green', 'blue'],
                  },
                ],
              }} 
                options={{
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    datalabels: {
                      color: '#fff', // สีตัวเลข
                      font: {
                        size: 20,
                        weight: 'bold',
                      },
                      formatter: (value) => value, // แสดงค่าจริง
                    },
                  },
                }}
              />
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats