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
    location: string;
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
}[];

export type GetCollectionResponse = {
  data: CollectionData;
  success: boolean;
  message: string;
};
