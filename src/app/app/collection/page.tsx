import Collection from "@/components/collection/userCollection/collection";
import React from "react";

const CollectionPage = () => {
  return (
    <div
      className={`flex flex-col justify-center items-center border border-black`}
    >
      <div className={`border-b border-black p-3 w-full text-center`}>
        <p className="text-2xl font-bold">Collection</p>
      </div>
      <div className={`py-3 px-3`}>
        <Collection />
      </div>
    </div>
  );
};

export default CollectionPage;
