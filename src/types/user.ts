import { $Enums } from "@prisma/client";

type Pagination = {
  totalData: number;
  totalPage: number;
};

export type GetUserProfileResponse = {
  id: string;
  username: string;
  email: string;
  name: string | null;
  birthDate: Date | null;
  phone: string | null;
  password: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: $Enums.UserRole;
};

export type GetAllUserResponse = {
  message: string;
  data: GetUserProfileResponse[];
  pagination: Pagination;
};
