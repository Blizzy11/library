export type GetRackResponse = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  locationId: number;
  createdAt: string;
  updatedAt: string;
  location: {
    id: number;
    name: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type GetRackResponseArray = GetRackResponse[];
