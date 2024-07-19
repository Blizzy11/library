import Carousel from "../carousel/customCarousel";
import "../landingPage/LandingPage.css";
import { IoIosArrowRoundForward } from "react-icons/io";

const data = [
  {
    title: "Document collection",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro nostrum voluptates hic vero assumenda. Iure neque quis accusamus doloremque alias soluta eveniet eius inventore veniam.",
    link: "Learn More",
  },
  {
    title: "Document collection",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro nostrum voluptates hic vero assumenda. Iure neque quis accusamus doloremque alias soluta eveniet eius inventore veniam.",
    link: "Learn More",
  },
  {
    title: "Document collection",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro nostrum voluptates hic vero assumenda. Iure neque quis accusamus doloremque alias soluta eveniet eius inventore veniam.",
    link: "Learn More",
  },
];

export default function ContentSection() {
  return (
    <div
      className="flex flex-col justify-center items-center py-6"
      id="document-collection"
    >
      <div className="bg-fuchsia-500 p-1 text-white">
        <p className="text-xl font-normal whiteSelection">
          Document collection
        </p>
      </div>
      <div className="text-center font-normal py-2 text-md md:text-lg lg:text-xl">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda quis
        magnam laudantium cum, est rem nihil fugit, recusandae voluptatibus
        nesciunt alias aliquid doloribus quo possimus officiis dolorem dolorum
        vel ea!
      </div>
      <div className="py-6 my-6 hidden sm:flex flex-wrap w-full lg:w-10/12 justify-center items-center bg-black text-white">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col gap-6 w-1/3 p-5 border-r border-white ${
              index === data.length - 1 ? "border-r-0" : ""
            }`}
          >
            <p className="whiteSelection self-start text-left">
              {item.content}
            </p>
            <div>
              <a
                href=""
                className="flex flex-row text-fuchsia-500 hover:text-fuchsia-700 transition-all duration-200 ease-in-out"
              >
                {item.link}
                <IoIosArrowRoundForward className="rotate-[-45deg]" size={25} />
              </a>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="carousel w-full space-x-6 py-6">
        <div className="carousel-item w-[80%] flex flex-col gap-4 border border-black rounded-md p-3 carousel-card">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo sunt
            harum doloremque magni unde facere. Odio deleniti dolorum mollitia
            molestias ducimus voluptates tempore assumenda alias!
          </p>
          <div className="flex flex-row gap-2 items-center">
            <span className="font-semibold text-fuchsia-500">Learn More</span>
            <IoIosArrowRoundForward
              className="text-fuchsia-500 rotate-[-45deg]"
              size={25}
            />
          </div>
        </div>

        <div className="carousel-item w-[80%] flex flex-col gap-4 border border-black rounded-md p-3 carousel-card">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo sunt
            harum doloremque magni unde facere. Odio deleniti dolorum mollitia
            molestias ducimus voluptates tempore assumenda alias!
          </p>
          <div className="flex flex-row gap-2 items-center">
            <span className="font-semibold text-fuchsia-500">Learn More</span>
            <IoIosArrowRoundForward
              className="text-fuchsia-500 rotate-[-45deg]"
              size={25}
            />
          </div>
        </div>
      </div> */}
      <div className="py-3 sm:hidden">
        <Carousel data={data} />
      </div>
    </div>
  );
}
