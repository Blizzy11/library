import { useState, useEffect } from "react";
import axios from "axios";
import { GetUserProfileResponse } from "@/types/user";

export function useLastTransactionApproved(id: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLastTransactionApproved = async () => {
      try {
        const res = await axios.get(
          "/api/v1/transaction/borrow/getTransactionApproved",
          {
            params: {
              itemId: id,
              limit: 1,
              page: 1,
            },
          }
        );
        setData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getLastTransactionApproved();
  }, [id]);

  return { data, loading, error };
}

export function useSendMessageTransactionRequest() {
  const [dataUser, setDataUser] = useState<GetUserProfileResponse[]>([]);

  const getAdminUser = async () => {
    try {
      const res = await axios.get("/api/v1/user", {
        params: {
          role: "ADMIN",
        },
      });
      setDataUser(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getAdminUser();
  }, []);

  return { dataUser };
}
