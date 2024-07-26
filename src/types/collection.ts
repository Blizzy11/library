type Pagination = {
  totalData: number;
  totalPage: number;
};

export type CollectionData = {
  id: string;
  name: string;
  number: string;
  description: string;
  rackId: string;
  categoryId: string;
  imageCover: null;
  is_active: true;
  views: number;
  availability: string;
  createdAt: string | Date;
  updatedAt: string | Date;
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

export type GetCollectionByIdResponse = {
  id: string;
  name: string;
  number: string;
  description: string;
  rackId: number;
  categoryId: number;
  imageCover: string | null;
  is_active: boolean;
  views: number;
  availability: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  rack: {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    locationId: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    location: {
      id: number;
      name: string;
      is_active: boolean;
      createdAt: string | Date;
      updatedAt: string | Date;
    };
  };
  category: {
    id: number;
    name: string;
    is_active: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
};
