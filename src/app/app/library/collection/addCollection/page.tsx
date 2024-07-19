import CollectionForm from "@/components/form/collection/addCollection";

const UserAddCollectionPage = () => {
  return (
    <div className={"flex flex-col border border-black"}>
      <div className="border-b border-black p-5">
        <span className={"text-2xl font-bold"}>Create New Collection</span>
      </div>
      <div>
        <CollectionForm />
      </div>
    </div>
  );
};

export default UserAddCollectionPage;
