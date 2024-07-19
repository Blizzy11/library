"use client";

import React, { useState, useEffect } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";

interface CarouselProps {
  data: {
    title: string;
    content: string;
    link: string;
  }[];
}

const Carousel = ({ data }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 3000); // Ganti setiap 3 detik

    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <div className="carousel w-full overflow-hidden relative py-6">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 85}%)` }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="carousel-item w-[80%] md:w-2/3 lg:w-1/2 flex-shrink-0 flex flex-col gap-4 border border-black rounded-md p-4 mx-2 carousel-card"
          >
            <p>{item.content}</p>
            <div className="flex flex-row gap-2 items-center">
              <span className="font-semibold text-fuchsia-500">Learn More</span>
              <IoIosArrowRoundForward
                className="text-fuchsia-500 rotate-[-45deg]"
                size={25}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
