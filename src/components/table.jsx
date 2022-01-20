import React from "react";
import { useTable, useSortBy, useRowSelect } from "react-table";
import { Checkbox } from "@shopify/polaris";
import { tw } from "twind";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, checked, title, onChange }, ref) => {
    console.log(indeterminate);
    return (
      <Checkbox
        ariaControls={title}
        checked={indeterminate ? "indeterminate" : checked}
        ref={ref}
        onChange={(newChecked) => {
          onChange({
            target: {
              checked: newChecked,
            },
          });
        }}
      />
    );
  }
);

export function Table({ data }) {
  const tableData = React.useMemo(() => data, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "URL",
        accessor: "url",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Orders",
        accessor: "orders",
      },
      {
        Header: "Amount Spent",
        accessor: "amountSpent",
      },
    ],
    []
  );

  const getRowId = React.useCallback((row) => {
    return row?.id;
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    { columns, data: tableData, getRowId },
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  return (
    <div className="">
      {JSON.stringify(selectedRowIds)}
      <table className={tw`w-full`} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                return (
                  <th
                    className={tw`text-left`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr className="" {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td className="" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
