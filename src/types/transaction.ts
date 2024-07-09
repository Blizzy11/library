export type Pagination = {
  totalData: number;
  totalPage: number;
};

export type TransactionResponse = GetTransactionDetailResponse[];

export type GetTransactionDetailResponse = {
  id: string;
  userId: string;
  itemId: string;
  borrowNumber: string;
  description: string;
  borrowDate: string;
  returnDate: string;
  status: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  item: {
    id: string;
    name: string;
    description: string;
    rackId: string;
    categoryId: string;
    imageCover: string | null;
    is_active: boolean;
    views: number;
    availability: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    username: string;
    nik: string | number | null;
    email: string;
    name: string | null;
    birthDate: string | null;
    phone: string;
    password: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    role: string;
  };
};

export type GetTransactionResponse = {
  message: string;
  data: TransactionResponse;
  pagination: Pagination;
};
