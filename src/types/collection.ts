type Pagination = {
  totalData: number;
  totalPage: number;
};

export type CollectionData = {
  id: string;
  name: string;
  number: string;
  description: string;
  rack_name: string;
  locationId: number;
  categoryId: string;
  imageCover: null;
  is_active: true;
  views: number;
  availability: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  location: {
    id: number;
    name: string;
    is_active: boolean;
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
  rack_name: string;
  locationId: number;
  categoryId: number;
  imageCover: string | null;
  is_active: boolean;
  views: number;
  availability: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  location: {
    id: number;
    name: string;
    is_active: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  category: {
    id: number;
    name: string;
    is_active: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
};
