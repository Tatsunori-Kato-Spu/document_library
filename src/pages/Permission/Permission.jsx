import { useState } from 'react'
import './permission.css'

function Permission(){
const [count, setCount] = useState(0)
  
return (
  <div className="background">
    <div className='search'>
     <p>Search</p>
    </div>
    <div className='permissionContainer'>
        <table className='tablePermission'>
      <thead>
      <tr className='trHead'>
        <th></th>
        <th>ชื่อ</th>
        <th>หมายเลข</th>
        <th>หน่วยงาน</th>
        <th>ตำแหน่ง</th>
        <th>Email</th>
        <th>ติดต่อ</th>
        <th>ระดับสิทธิ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><img src="./public/img/profile.png" alt="" srcset="" /></td>
        <td>นายสมชาย สุขสันต์</td>
        <td>123-456-789</td>
        <td>ฝ่ายบัญชี</td>
        <td>เจ้าหน้าที่บัญชี</td>
        <td>sumchai@email.com</td>
        <td>081-123-4XXX</td>
        <td>ระดับสูง</td>
      </tr>
      
      <tr>
        <td><img src="./public/img/profile.png" alt="" srcset="" /></td>
        <td>นายสมชาย สุขสันต์</td>
        <td>123-456-789</td>
        <td>ฝ่ายบัญชี</td>
        <td>เจ้าหน้าที่บัญชี</td>
        <td>sumchai@email.com</td>
        <td>081-123-4XXX</td>
        <td>ระดับสูง</td>
      </tr>
      <tr>
        <td><img src="./public/img/profile.png" alt="" srcset="" /></td>
        <td>นายสมชาย สุขสันต์</td>
        <td>123-456-789</td>
        <td>ฝ่ายบัญชี</td>
        <td>เจ้าหน้าที่บัญชี</td>
        <td>sumchai@email.com</td>
        <td>081-123-4XXX</td>
        <td>ระดับสูง</td>
      </tr>
    </tbody>
        </table>
    </div>

<br />

  </div>
)
}

export default Permission