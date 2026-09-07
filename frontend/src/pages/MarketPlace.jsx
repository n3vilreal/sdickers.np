import React from 'react'
import StickerCard from '../cards/StickerCard';

export default function MarketPlace() {
    const meterValue = 50;

    const sticker = [
        {
            key: 1,
            stickerImage: "https://i.pinimg.com/1200x/75/a5/a5/75a5a58a13f283429e6cf1cf914665bc.jpg",
            stickerName: "J Cole",
            collectionType: "MUSIC",
            stickerPrice: 35
        },
        {
            key: 2,
            stickerImage: "https://i.pinimg.com/1200x/75/a5/a5/75a5a58a13f283429e6cf1cf914665bc.jpg",
            stickerName: "J Cole",
            collectionType: "MUSIC",
            stickerPrice: 35
        },
        {
            key: 3,
            stickerImage: "https://i.pinimg.com/1200x/75/a5/a5/75a5a58a13f283429e6cf1cf914665bc.jpg",
            stickerName: "J Cole",
            collectionType: "MUSIC",
            stickerPrice: 35
        },
        {
            key: 4,
            stickerImage: "https://i.pinimg.com/1200x/75/a5/a5/75a5a58a13f283429e6cf1cf914665bc.jpg",
            stickerName: "J Cole",
            collectionType: "MUSIC",
            stickerPrice: 35
        },
        {
            key: 5,
            stickerImage: "https://i.pinimg.com/1200x/75/a5/a5/75a5a58a13f283429e6cf1cf914665bc.jpg",
            stickerName: "J Cole",
            collectionType: "MUSIC",
            stickerPrice: 35
        },
        {
            key: 6,
            stickerImage: "https://i.pinimg.com/1200x/75/a5/a5/75a5a58a13f283429e6cf1cf914665bc.jpg",
            stickerName: "J Cole",
            collectionType: "MUSIC",
            stickerPrice: 35
        },
        {
            key: 7,
            stickerImage: "https://i.pinimg.com/1200x/75/a5/a5/75a5a58a13f283429e6cf1cf914665bc.jpg",
            stickerName: "J Cole",
            collectionType: "MUSIC",
            stickerPrice: 35
        }
    ]
  return (
    <div className='w-screen h-screen bg-[#111111] pt-12 pb-12'>
        {/* container */}
        <div className='flex w-full h-full'>
            {/* menu */}
            <div className='w-[15%] flex flex-col items-center gap-y-14'>
                {/* categories */}
                <div className='flex flex-col text-xs text-[#8a8a8a] gap-y-4 w-[60%]'>
                    <span className='font-semibold text-[#00ff66]'>CATEGORIES</span>
                    <span>Anime</span>
                    <span>Music</span>
                    <span>Movies</span>
                    <span>Memes</span>
                </div> 
                
                {/* finish */}
                <div className='flex flex-col text-xs text-[#8a8a8a] gap-y-4 w-[60%]'>
                    <span className='font-semibold text-white'>FINISH</span>
                    <span>Matte</span>
                    <span>Glossy</span>
                    <span>Holographic</span>
                </div>

                {/* availability */}
                <div className='flex flex-col text-xs text-[#8a8a8a] gap-y-4 w-[60%]'>
                    <span className='font-semibold text-white'>AVAILABILITY</span>
                    <span>In Stock</span>
                    <span>Pre-Order</span>
                </div>
                
            </div>
            
            {/* shop */}
            <div className='flex flex-col w-[85%] px-16'>
                {/* top */}
                <div className='flex justify-between w-full items-center'>
                    <div className='flex flex-col'>
                        <span className='text-2xl text-white font-semibold'>SHOP ALL</span>
                        <span className='text-xs text-[#515151]'>Showing Premium Collectibles</span>
                    </div>
                    <div className='flex justify-center items-center'>
                        <select name="" id="" className='text-white text-xs font-semibold p-3 rounded-xl border-1 border-[#2e2e2e] bg-[#181818]'>
                            <option value="">MOST POPULAR</option>
                        </select>
                    </div>
                </div>

                {/* main shop */}
                <div className='grid grid-cols-4 gap-10 mt-6'>
                    {
                        sticker.map((item)=>(
                            <StickerCard
                                key={item.key}
                                stickerImage={item.stickerImage}
                                stickerName={item.stickerName}
                                collectionType={item.collectionType}
                                stickerPrice={item.stickerPrice}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
