"use client";

import {
  GetTransactionResponse,
  TransactionResponse,
} from "@/types/transaction";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiOutlineContainer } from "react-icons/ai";
import { toast } from "sonner";
import advancedFormat from "dayjs/plugin/advancedFormat";
import CustomButton from "@/components/button/customButton";

dayjs.extend(advancedFormat);

const TransactionCard = () => {
  // get session
  const isSession = useSession();
  const { data: session } = isSession;

  // State
  const [data, setData] = useState<TransactionResponse>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // to track if there are more data to load

  const getTransaction = async () => {
    // get transaction
    if (isSession.status !== "authenticated") {
      return toast.error("You are not authenticated");
    }

    try {
      await axios
        .get("/api/v1/transaction/borrow", {
          params: {
            userId: session?.user.id,
            page: page,
            limit: 10,
          },
        })
        .then((res) => {
          setData((prevData) => [...prevData, ...res.data.data]);

          if (
            res.data.data.length === 0 ||
            data.length >= res.data.pagination.totalData ||
            res.data.pagination.totalPage === page
          ) {
            setHasMore(false); // no more data to load
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  useEffect(() => {
    getTransaction();
  }, [page]);

  return (
    <div className={`flex flex-col gap-3 border`}>
      {loading ? (
        <span className="loading loading-dots loading-md self-center"></span>
      ) : (data?.length ?? 0) > 0 ? (
        data?.map((item) => (
          <div
            className="flex flex-col border border-black w-full"
            key={item.id}
          >
            <div className="flex flex-col justify-between p-3">
              <div className="flex flex-row gap-4 items-center border-b border-black pb-2">
                <AiOutlineContainer size={20} />
                <div className="text-sm md:text-md lg:text-lg font-bold">
                  {item.borrowNumber}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-lg font-bold">{item.Item.name}</div>
                <div className="text-xs">
                  {dayjs(item.borrowDate).format("dddd, DD MMMM YYYY") +
                    " - " +
                    dayjs(item.returnDate).format("dddd, DD MMMM YYYY")}
                </div>
                <div className="flex flex-row gap-2 text-xs self-end">
                  <div className={`border border-black rounded-md p-1 w-fit`}>
                    {item.status}
                  </div>
                  <button
                    onClick={() => {
                      toast.success(item.id);
                    }}
                    className={`bg-black text-white rounded-md p-1 w-fit`}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No transaction found</div>
      )}

      {/* Load more button */}
      {hasMore && !loading && data.length > 0 && (
        <div className="flex justify-center">
          <CustomButton
            disabled={loading}
            type="button"
            classname="px-3 py-1"
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            Load More
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
