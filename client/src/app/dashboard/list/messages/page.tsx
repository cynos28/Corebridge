import Pagination from "@/app/component/Pagination";
import Table from "@/app/component/Table";
import TableSearch from "@/app/component/TableSearch";
import { messagesData } from "@/lib/data";
import Image from "next/image";

type Message = {
  id: number;
  sender: string;
  recipient: string;
  messege: string;
};

const columns = [
  {
    header: "Sender",
    accessor: "sender",
  },
  {
    header: "Recipient",
    accessor: "recipient",
    className: "hidden md:table-cell",
  },
  {
    header: "Message",
    accessor: "messege",
    className: "hidden md:table-cell",
  },

];

const MessageListPage = () => {
  const renderRow = (message: Message) => (
    <tr
      key={message.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-cbPurpleLight"
    >
      <td className="p-4 font-medium">{message.sender}</td>
      <td className="hidden md:table-cell">{message.recipient}</td>
      <td className="hidden md:table-cell">{message.messege}</td>
      
      
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Messages</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cbYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {/* MESSAGE TABLE */}
      <Table columns={columns} renderRow={renderRow} data={messagesData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default MessageListPage;
