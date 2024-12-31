import React, { useEffect, useState } from "react";

interface CaseContent {
  id: string;
  email: string;
  descp: string;
  gameName: string;
  status: string;
  createdDate: string;
}

function CaseDetailsTable() {
  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Case Details Table</h1>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Case Id</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">
                Case Description
              </th>
              <th className="border border-gray-300 px-4 py-2">Game Name</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Created Date</th>
            </tr>
          </thead>

          <tbody></tbody>
        </table>
      </div>
    </>
  );
}

export default CaseDetailsTable;
