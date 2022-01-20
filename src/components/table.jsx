import React from "react";
import { useTable, useSortBy, useRowSelect, useFlexLayout } from "react-table";
import { Checkbox, Icon } from "@shopify/polaris";
import { CaretUpMinor, CaretDownMinor } from "@shopify/polaris-icons";
import { tw } from "twind";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, checked, title, onChange }, ref) => {
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
    useFlexLayout,
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
    <div className={tw`relative w-full h-full`}>
      <table className={tw`w-full relative`} {...getTableProps()}>
        <thead className={tw`relative sticky top-0 bg-white z-10`}>
          {headerGroups.map((headerGroup) => (
            <tr className={tw`relative`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <th
                    className={tw`text-left p-4 bg-white font-medium border-b flex items-center select-none`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span
                      className={tw`top-px relative inline-flex items-center justify-center`}
                    >
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <Icon source={CaretDownMinor} color="base" />
                        ) : (
                          <Icon source={CaretUpMinor} color="base" />
                        )
                      ) : (
                        ""
                      )}
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
              <tr className={tw`border-t`} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={tw`px-4 py-2 flex ${
                        cell.column.id === "selection" ? "items-center" : ""
                      }`}
                      {...cell.getCellProps()}
                    >
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
