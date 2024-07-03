import ModalAddFormLocation from "@/components/modal/modalComponent/modalAddFormLocation";
import Table from "@/components/table/table";
import TableLocation from "@/components/table/tableLocation";

const dataHeader = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "is_active",
    label: "Status",
  },
];

const LocationPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <TableLocation />
    </div>
  );
};

export default LocationPage;
