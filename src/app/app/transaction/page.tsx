import TransactionCard from "@/components/app/transaction/transactionCard";

export default function TransactionPage() {
  return (
    <div className={`flex flex-col justify-center items-center gap-3`}>
      <p className={`text-lg font-bold`}>Transaction</p>
      <div className="w-full">
        <TransactionCard />
      </div>
    </div>
  );
}
