import React from 'react'
export default function Reviews({stars, reviewDescription, userName, userImage}) {
  return (
    <>
        <div className='flex flex-col justify-center gap-y-2 bg-[#242424] rounded-2xl h-[150px] w-[350px] pl-4 hover:scale-x-110 duration-500 ease-in-out'>
            <div className='text-[#00ff66] flex gap-0.5'>
                {stars}
            </div>
            <div className='text-[#8a8a8a]'>
                "{reviewDescription}"
            </div>
            <div className='text-white font-semibold flex gap-x-2 items-center'>
                <img src={userImage} alt="" className='h-[40px] w-[40px] rounded-full'/>
                {userName}
            </div>
        </div>
    </>
  )
}
