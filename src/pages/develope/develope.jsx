import './develope.css'

function Develope() {
    return (
        <div className='develope-main'>
                <h1>ผู้พัฒนา</h1>
            <div className="develope" >


                <div className='container-develope'>
                    <span> <img src="1.jpg" alt="" srcset="" className='develope-img' /> </span>
                    <span className='develope-name'> 66038668 </span>
                    <span className='develope-name'> นาย สรชา ชายไพฑูรย์</span>
                </div>
                <div className='container-develope'>
                    <span> <img src="2.jpg" alt="" srcset="" className='develope-img' /> </span>
                    <span className='develope-name'> 66044011 </span>
                    <span className='develope-name'> นาย ทัตซึโนริ คาโต้ </span>
                </div >
                <div className='container-develope'>
                    <span> <img src="3.jpg" alt="" srcset="" className='develope-img' /> </span>
                    <span className='develope-name'> 66070195 </span>
                    <span className='develope-name'> นางสาว ณัฐธิชา ลาสองชั้น </span>
                </div>

            </div>
        </div>
    );
}

export default Develope;