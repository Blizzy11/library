"use client";

import Image from "next/image";
import CustomButton from "../button/customButton";
import { toast } from "sonner";

export default function Hero() {
  return (
    <div className="hero py-10 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse items-center lg:items-start">
        <Image
          src={"/hero.svg"}
          alt="hero"
          width={450}
          height={450}
          className="hidden md:block lg:ml-10"
        />
        <div className="w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-4xl md:text-6xl font-semibold md:font-bold">
              Document collection
            </p>
            <p className="text-4xl md:text-6xl md:w-1/2 font-semibold md:font-bold">
              for easy control and tracking
            </p>
          </div>
          <p className="py-6 text-center lg:text-left md:w-1/2">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <div className="gap-6 flex flex-col lg:flex-row items-center lg:items-start">
            <CustomButton
              boxShadow="6px 6px"
              classname="py-2 px-4 w-full md:w-auto hover:bg-black hover:text-white transition duration-500 ease-in-out"
              type="button"
              onClick={() => {}}
            >
              Get Started
            </CustomButton>
            <CustomButton
              boxShadow="6px 6px"
              classname="py-2 px-4 w-full md:w-auto bg-black text-white hover:bg-white hover:text-black transition duration-500 ease-in-out"
              type="button"
              onClick={() => {
                toast.warning("This feature is not available yet");
              }}
            >
              User Guide
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}
