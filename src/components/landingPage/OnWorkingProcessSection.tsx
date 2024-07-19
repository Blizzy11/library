import "@/components/landingPage/LandingPage.css";

const dataAccordion = [
  {
    title: "Membuat Akun",
    content:
      "Buat akun untuk mengakses semua fitur aplikasi kami dengan mudah.",
  },
  {
    title: "Melakukan Login",
    content:
      "Masuk ke akun Anda untuk memulai proses peminjaman collection document.",
  },
  {
    title: "Meminjam Collection Document",
    content:
      "Pilih collection document yang ingin Anda pinjam dan tentukan tanggal mulai peminjaman dan tanggal kembali yang diinginkan.",
  },
  {
    title: "Menunggu Approval",
    content: "Setelah peminjaman diterima, Anda akan menerima notifikasi.",
  },
  {
    title: "Collection Document Bisa Dipinjam",
    content: "Setelah peminjaman diterima, Anda akan menerima notifikasi.",
  },
  {
    title: "Melakukan Pengembalian",
    content:
      "Kembalikan collection document sesuai dengan tanggal yang telah ditetapkan untuk menghindari keterlambatan dan memastikan ketersediaan untuk pengguna lain.",
  },
];

export default function OnWorkingProcessSection() {
  return (
    <section className="bg-white dark:bg-gray-900 py-6 flex flex-col gap-5">
      <div className="w-full flex justify-center">
        <h1 className="text-xl font-normal text-white whiteSelection text-center max-w-40 bg-fuchsia-500 p-1">
          Our Working Process
        </h1>
      </div>
      <div className="text-center font-normal py-2 text-md md:text-lg lg:text-xl ">
        Step by Step to get started for borrow and lend the collection
      </div>

      <div className="flex flex-col justify-center gap-4 items-center">
        {dataAccordion.map((item, index) => (
          <div
            key={index}
            className="collapse collapse-arrow rounded-none bg-white md:w-3/4"
          >
            <input
              type="radio"
              name="my-accordion-2"
              {...(index === 0 && { defaultChecked: true })}
            />
            <div className="collapse-title text-xl text-black font-medium">
              {index + 1}. {" " + item.title}
            </div>
            <div className="collapse-content text-black">
              <p className="text-sm font-normal whiteSelection">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
