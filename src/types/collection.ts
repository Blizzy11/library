type Pagination = {
  totalData: number;
  totalPage: number;
};

export type CollectionData = {
  id: string;
  name: string;
  description: string;
  rackId: string;
  categoryId: string;
  imageCover: null;
  is_active: true;
  views: number;
  availability: string;
  createdAt: string;
  updatedAt: string;
  rack: {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    locationId: number;
    location: {
      id: number;
      name: string;
      is_active: boolean;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  category: {
    id: string;
    name: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type GetCollectionResponse = {
  message: string;
  data: CollectionData[];
  pagination: Pagination;
};
