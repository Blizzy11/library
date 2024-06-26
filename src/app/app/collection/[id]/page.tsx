import UserViewCollection from "@/components/app/userViewCollection/userViewCollection";
import React from "react";

const ViewCollectionPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <UserViewCollection id={params.id} />
    </div>
  );
};

export default ViewCollectionPage;
