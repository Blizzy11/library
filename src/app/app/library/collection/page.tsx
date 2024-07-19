import { CollectionPagesComponent } from "@/components/admin/collection/collectionPages";
import React from "react";

const UserCollectionPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-xl font-bold">My Collection</span>
      <CollectionPagesComponent />
    </div>
  );
};

export default UserCollectionPage;
