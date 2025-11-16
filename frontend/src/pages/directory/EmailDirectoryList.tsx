import React from "react";
import { useSelector } from "react-redux";
import { useGetMyEmailListQuery, useGetAllEmailListQuery, useDeleteEmailMutation } from "@/redux/api/emailDirectoryApi";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const EmailDirectoryList = () => {
const roles = useSelector((state: any) => state.auth?.user.roles|| []);
const isAdmin = Array.isArray(roles) && roles.includes("admin");
console.log(isAdmin,roles)

  // Call API based on role
  const { data, isLoading, refetch } = isAdmin
    ? useGetAllEmailListQuery(null)
    : useGetMyEmailListQuery(null);

const [deleteEmail] = useDeleteEmailMutation();

const handleDelete = async (id: string) => {
  try {
    await deleteEmail(id).unwrap();
    alert("Deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};

  if (isLoading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 mt-2">
      <h2 className="text-lg font-semibold text-white mb-4">
        My Email Directory
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="bg-gray-800 text-gray-400 uppercase text-xs">
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">User ID</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.length === 0 && (
              <tr>
                <td
                  className="py-4 px-4 text-center text-gray-500"
                  colSpan={4}
                >
                  No emails found.
                </td>
              </tr>
            )}

            {data?.map((emailItem) => (
              <tr
                key={emailItem._id}
                className="border-t border-gray-700 hover:bg-gray-800/60"
              >
                <td className="py-2 px-4">{emailItem.email}</td>
                <td className="py-2 px-4">{emailItem.userId}</td>
                <td className="py-2 px-4">
                  {new Date(emailItem.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(emailItem._id)}
                    className="p-1 rounded hover:bg-red-800/40"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailDirectoryList;
