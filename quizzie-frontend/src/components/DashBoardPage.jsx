import React from 'react'

function DashBoardPage() {
  return (
    <div>
      <div className='dashboard-numbers-1'>
        <div className='dashboard-numbers' style={{color: '#FF5D01'}}>
            <div>
                <span>
                   12
                </span>  Quiz
                    
            </div>
            <div>
                Created
            </div>
        </div>

        <div className='dashboard-numbers' style={{color: '#60B84B'}}>
            <div>
               <span>
                 110
                </span>  questions
            </div>
            <div>
                Created
            </div>
        </div>

        <div className='dashboard-numbers' style={{color: '#5076FF'}}>
        <div>
               <span>
                 1.4K  
                </span> Total 
            </div>
            <div>
              Impressions
            </div>
        </div>
      </div>

      <div className='quizzes-section'>
         <div>
            <h1 style={{color: '#474444'}}>Trending Quizs</h1>
         </div>

         <div>
            <div className='quiz-data-header'>
                <div className='quiz-data'>
                <p style={{fontSize: '1.25em'}}>Quiz 1</p>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <p style={{color: '#FF5D01'}}>
                    667
                    </p>
                    <svg width="24" height="24" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FF5D01"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5 12.714C18.5 15.081 15.366 17 11.5 17C7.634 17 4.5 15.081 4.5 12.714C4.5 10.347 7.634 8.42896 11.5 8.42896C15.366 8.42896 18.5 10.347 18.5 12.714Z" stroke="#FF5D01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2501 12.714C13.2647 13.4249 12.8477 14.074 12.1951 14.3562C11.5424 14.6384 10.7839 14.4977 10.2759 14.0002C9.76792 13.5027 9.61148 12.7472 9.8801 12.0889C10.1487 11.4305 10.789 11.0001 11.5001 11C11.9594 10.9952 12.4019 11.1731 12.7301 11.4945C13.0583 11.816 13.2453 12.2546 13.2501 12.714V12.714Z" stroke="#FF5D01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10.75 8.429C10.75 8.84321 11.0858 9.179 11.5 9.179C11.9142 9.179 12.25 8.84321 12.25 8.429H10.75ZM12.25 5C12.25 4.58579 11.9142 4.25 11.5 4.25C11.0858 4.25 10.75 4.58579 10.75 5H12.25ZM18.2931 7.05471C18.4813 6.68571 18.3347 6.23403 17.9657 6.04586C17.5967 5.85769 17.145 6.00428 16.9569 6.37329L18.2931 7.05471ZM15.5199 9.19129C15.3317 9.5603 15.4783 10.012 15.8473 10.2001C16.2163 10.3883 16.668 10.2417 16.8561 9.87271L15.5199 9.19129ZM6.04314 6.37329C5.85497 6.00428 5.40329 5.85769 5.03429 6.04586C4.66528 6.23403 4.51869 6.68571 4.70686 7.05471L6.04314 6.37329ZM6.14386 9.87271C6.33203 10.2417 6.78371 10.3883 7.15271 10.2001C7.52172 10.012 7.66831 9.5603 7.48014 9.19129L6.14386 9.87271ZM12.25 8.429V5H10.75V8.429H12.25ZM16.9569 6.37329L15.5199 9.19129L16.8561 9.87271L18.2931 7.05471L16.9569 6.37329ZM4.70686 7.05471L6.14386 9.87271L7.48014 9.19129L6.04314 6.37329L4.70686 7.05471Z" fill="#FF5D01"></path> </g></svg>
                </div>
                </div>
                <div style={{color: '#60B84B', padding: '0.5vw 1vw'}}>
                    Created on : <span>
                        04 Sep, 2023
                    </span>
                </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default DashBoardPage