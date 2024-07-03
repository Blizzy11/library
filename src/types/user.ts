import { $Enums } from "@prisma/client";

export type GetUserProfileResponse = {
  id: string;
  username: string;
  nik: string | null;
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
