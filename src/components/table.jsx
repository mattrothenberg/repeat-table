import React from "react";
import { useTable, useSortBy, useRowSelect, useFlexLayout } from "react-table";
import {
  Badge,
  Button,
  ButtonGroup,
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
        label={title}
        labelHidden
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
            <div className={tw`flex items-center`}>
              <span
                className={tw`${
                  original.inventory < 0 && "bg-yellow-200"
                } inline-block mr-1`}
              >
                {formatted}{" "}
              </span>{" "}
              in stock
            </div>
          );
        },
      },
      {
        Header: "Replenishment Interval",
        accessor: "interval",
        minWidth: 180,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <div className={tw`flex items-center z-0`}>
              <TextField
                type="number"
                value={String(original.interval)}
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
        width: 160,
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
        width: 170,
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
    toggleAllRowsSelected,
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
          width: 60,
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div className={tw`flex items-center pl-4`}>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div className={tw`flex items-center pl-4`}>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const numRowsSelected = Object.keys(selectedRowIds).length;

  return (
    <div className={tw`relative w-full h-full`}>
      <table className={tw`w-full relative`} {...getTableProps()}>
        <thead
          className={tw`relative sticky top-0 bg-white z-10 flex-shrink-0 h-[58px] flex`}
        >
          {numRowsSelected > 0 && (
            <tr
              className={tw`absolute inset-0 w-full h-full bg-white z-10 p-4 border-b`}
            >
              <th>
                <ButtonGroup segmented>
                  <Button
                    onClick={() => toggleAllRowsSelected(false)}
                    size="slim"
                  >
                    <div className={tw`flex items-center`}>
                      <div className={tw`pointer-events-none flex`}>
                        <Checkbox checked />
                      </div>
                      {numRowsSelected} selected
                    </div>
                  </Button>
                  <Button>Create Featured Product Cart</Button>
                  <Button>Create QR Code</Button>
                  <Button disclosure>More actions</Button>
                </ButtonGroup>
              </th>
            </tr>
          )}
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
              <tr
                className={tw`border-t ${
                  row.isSelected ? "bg-blue-50" : "bg-white"
                }`}
                {...row.getRowProps()}
              >
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
