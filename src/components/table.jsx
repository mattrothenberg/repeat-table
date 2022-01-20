import React from "react";
import { useTable, useSortBy, useRowSelect, useFlexLayout } from "react-table";
import {
  Badge,
  Checkbox,
  Icon,
  TextField,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
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
        Header: "Title ID / Variant ID",
        accessor: "id",
        width: 300,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <div className={tw`py-4 flex items-center`}>
              <Thumbnail size="medium" source={original.photo} />
              <div className={tw`ml-4`}>
                <TextStyle variation="strong">{original.title}</TextStyle>
                <p>
                  {original.variantId} / {original.titleId}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Inventory",
        accessor: "inventory",
        Cell: ({ row }) => {
          const { original } = row;
          const formatted = new Intl.NumberFormat().format(original.inventory);
          return (
            <div className={tw`flex items-center`}>{formatted} in stock</div>
          );
        },
      },
      {
        Header: "Replenishment Interval",
        accessor: "interval",
        minWidth: 70,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <div className={tw`flex items-center z-0`}>
              <TextField
                type="number"
                value={String(original.inventory)}
                onChange={() => {
                  console.log("change");
                }}
                autoComplete="off"
              />
            </div>
          );
        },
      },
      {
        Header: "Online Store Status",
        accessor: "status",
        width: 120,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <div className={tw`flex items-center`}>
              <Badge status="success">{original.status}</Badge>
            </div>
          );
        },
      },
      {
        Header: "Repeat Sales Channel",
        accessor: "channel",
        width: 120,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <div className={tw`flex items-center`}>
              <Badge status="success">{original.channel}</Badge>
            </div>
          );
        },
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
          width: 40,
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
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
