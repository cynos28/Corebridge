import Image from "next/image";

type ResultTableSearchProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ResultTableSearch = ({ value, onChange }: ResultTableSearchProps) => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="Search Icon" width={14} height={14} />
      <input
        type="text"
        placeholder="Search by Subject Name..."
        value={value}
        onChange={onChange}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default ResultTableSearch;
