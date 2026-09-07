import React from 'react'
import sticker from '../assets/images/metro-boomin-sticker.jpeg'
import TrendingCollections from '../cards/TrendingCollections'
import Reviews from '../cards/Reviews'
import { IoStar } from "react-icons/io5"
const trending = [
    {
        id: 1,
        title: "SPIDER VERSE",
        bgImage: "https://i.pinimg.com/736x/b5/24/5f/b5245fa999ef0323bc0cbba3f5a9d60b.jpg"
    },
    {
        id: 2,
        title: "MOVIES",
        bgImage: "https://i.pinimg.com/1200x/2a/72/33/2a723335d74f6e96fb061909942ac19d.jpg"
    },
    {
        id: 3,
        title: "ROCK BANDS",
        bgImage: "https://i.pinimg.com/736x/40/66/14/406614169646c73356383fa37e9f87af.jpg"
    },
]
const reviews = [
    {
        id: 1,
        stars: 5,
        reviewDescription: "Awsome",
        userImage: "https://i.pinimg.com/736x/31/93/64/319364c3d37856f1fbfcf8bc4f88bc33.jpg",
        userName: "Aashrya Sharma"
    },
    {
        id: 2,
        stars: 5,
        reviewDescription: "Awsome",
        userImage: "https://i.pinimg.com/736x/7f/9b/f8/7f9bf8a58ada8d06048db32429581891.jpg",
        userName: "Shishir Nepal"
    },
    {
        id: 3,
        stars: 5,
        reviewDescription: "Awsome",
        userImage: "https://i.pinimg.com/736x/93/f9/ef/93f9ef30d198140dc8341a26e604110a.jpg",
        userName: "Naman Yadav"
    }
]
let shippedNumbers = 56;
let averageRating = 4.5;
let collectorNumbers = 13;
export default function
() {
  return (
    <>
    <div id='main' className=' w-screen h-180 bg-[#111111] flex justify-center items-center'>
        <div id="container" className='w-[50%] flex justify-between items-center'>
            <div id="left" className='flex flex-col w-[50%] gap-y-5'>
                <span className='text-[#8a8a8a] text-[11px]'>
                    SDICKERS DROP 003 - SECURE THE BATCH
                </span>
                <span className='font-sans text-white text-6xl font-bold'>
                    THE ART OF ADHESION
                </span>
                <span className='text-[#8a8a8a] text-[11px]'>
                    Limited-edition artist collabs printed on premium weatherproof vinyl. Each drop is finite — once it's gone, it's gone.
                </span>
                <span className='text-[11px] text-white font-bold border border-[#8a8a8a] w-37.5 h-10 flex justify-center items-center hover:bg-[#00ff66] hover:border-0 hover:text-black hover:cursor-pointer duration-500 ease-in-out'>
                    SHOP NEW DROP
                </span>
            </div>
            <div id="right">
                <img src={sticker} alt="sticker" className='h-64 hover:scale-110 duration-500 ease-in-out'/>
            </div>
        </div>
    </div>
    <div className='h-12.5 w-screen bg-[#181818] text-white flex justify-center text-xl items-center text-center font-bold gap-x-15'>
           <span>NEW DROP LIVE</span>
           <div className='h-[5px] w-[5px] bg-[#00ff66] rounded-full'></div>
           <span>NEW DROP LIVE</span>
           <div className='h-[5px] w-[5px] bg-[#00ff66] rounded-full'></div>
           <span>NEW DROP LIVE</span>
    </div>
    <div id='main' className=' w-screen h-180 bg-[#111111] flex justify-center items-center'>
        <div className='flex flex-col items-center justify-center gap-y-5'>
            <h1 className='font-sans text-white text-3xl font-bold'>TRENDING COLLECTIONS</h1>
            <div>
                <div className='flex gap-x-4'>
                    {
                        trending.map((item) => (
                            <TrendingCollections
                                key={item.id}
                                title={item.title}
                                bgImage={item.bgImage}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
    <div className='w-screen h-80 bg-[#00ff66] flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center w-[60%] font-sans gap-y-7'>
            <h1 className='text-4xl font-semibold'>JOIN THE CULTURE</h1>
            <p className='text-sm'>Get access to Premium Drops, Exclusive Merch and Members-Only Pricing.</p>
            <div className='flex justify-center items-center w-44 h-12 bg-black text-xs font-semibold text-white cursor-pointer hover:border-2 hover:border-black hover:bg-[#0000002f] hover:text-black duration-500 ease-in-out'>BECOME A MEMBER</div>
        </div>
    </div>
    <div className='w-screen h-[550px] bg-[#181818] flex justify-center items-center font-sans'>
        <div className='w-[80%] flex flex-col items-center justify-center space-y-6'>
            <div className='flex w-[100%] justify-around'>
                <div className='flex flex-col items-center justify-center gap-y-2'>
                    <span className='text-6xl font-semibold text-white'>{shippedNumbers - 1} +</span>
                    <span className='text-[#8a8a8a] text-xs'>Stickers Shipped</span>
                </div>
                <div className='flex flex-col items-center justify-center gap-y-2'>
                    <span className='text-6xl font-semibold text-white'>{averageRating}/5</span>
                    <span className='text-[#8a8a8a] text-xs'>Average Rating</span>
                </div>
                <div className='flex flex-col items-center justify-center gap-y-2'>
                    <span className='text-6xl font-semibold text-white'>{collectorNumbers - 1} +</span>
                    <span className='text-[#8a8a8a] text-xs'>Active Collectors</span>
                </div>
            </div>
            <div className='flex w-[100%] justify-around h-auto'>
                {
                    reviews.map((item)=>(
                        <Reviews
                            key={item.id}
                            stars={[...Array(item.stars)].map((_, index) => (
                                <IoStar key={index} />
                            ))}
                            reviewDescription = {item.reviewDescription}
                            userImage={item.userImage}
                            userName = {item.userName}
                        />
                    ))
                }
            </div>
        </div>
    </div>
    </>
  )
}
