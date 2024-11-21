import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Stats.css'
import { docdata } from '../../data/docdata';
import { userdata } from '../../data/userdata';
import Header from '../../Layout/Header/Header';

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

  const userCounts = {
    total: userdata.length, // จำนวนผู้ใช้งานทั้งหมด
    admin: userdata.filter(user => user.role?.includes('admin')).length, // จำนวนผู้ใช้ใน role admin
    worker: userdata.filter(user => user.role?.includes('worker')).length, // จำนวนผู้ใช้ใน role worker
  };

  const displayUserData = [
    { name: 'จำนวนผู้ใช้ทั้งหมด', value: userCounts.total },
    { name: 'จำนวนผู้ใช้ใน admin', value: userCounts.admin },
    { name: 'จำนวนผู้ใช้ใน worker', value: userCounts.worker }    
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
    <div>

      <Header/>
    <div className='stats'>


      <div className='statsContainer'>

        <div>


            {/* Static document count boxes */}
            <div className='statsContainer1'>
              {displayData.map((data, index) => (
                <div key={index} className='boxStats'>
                  <div className='textStatsTopic'>{data.name}</div>
                  <div className='textStatsNum'>{data.value}</div>
                </div>
              ))}
                    {/* Static user count boxes */}
                {displayUserData.map((data, index) => (
                  <div key={index} className="boxStats">
                    <div className="textStatsTopic">{data.name}</div>
                    <div className="textStatsNum">{data.value}</div>
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
                </div>
  )
}

export default Stats