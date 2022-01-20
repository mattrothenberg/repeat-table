import {
  randUuid,
  randFullName,
  randNumber,
  randProductName,
  randImg,
} from "@ngneat/falso";
import {
  Button,
  Card,
  ChoiceList,
  FilterInterface,
  Filters,
} from "@shopify/polaris";
import { useState } from "react";
import { tw } from "twind";
// @ts-ignore
import { Table } from "./components/table";

const data = Array.from({ length: 20 }).map((_, i) => {
  return {
    id: randNumber({ length: 2 }),
    photo: randImg(),
    title: randProductName(),
    titleId: randNumber({ length: 2 }),
    variantId: randNumber({ length: 2 }),
    inventory: randNumber({ max: 10, min: 1 }),
    interval: randNumber({ max: 30, min: 1 }),
    status: "Active",
    channel: "Available",
  };
});

function App() {
  const [query, setQuery] = useState("");

  const filters: FilterInterface[] = [
    {
      key: "status",
      label: "Online Store Status",
      shortcut: true,
      filter: (
        <ChoiceList
          title="Online Store Status"
          titleHidden
          choices={[
            { label: "Online Store", value: "Online Store" },
            { label: "Point of Sale", value: "Point of Sale" },
            { label: "Buy Button", value: "Buy Button" },
          ]}
          selected={[]}
          onChange={() => {}}
          allowMultiple
        />
      ),
    },
    {
      key: "visibility",
      label: "Cart Visibility",
      shortcut: true,
      filter: (
        <ChoiceList
          title="Cart Visibility"
          titleHidden
          choices={[
            { label: "Online Store", value: "Online Store" },
            { label: "Point of Sale", value: "Point of Sale" },
            { label: "Buy Button", value: "Buy Button" },
          ]}
          selected={[]}
          onChange={() => {}}
          allowMultiple
        />
      ),
    },
  ];

  return (
    <Card>
      <Card.Section>
        <Filters
          queryPlaceholder="Search by Title ID, Variant ID"
          queryValue={query}
          onQueryChange={setQuery}
          onQueryClear={() => setQuery("")}
          onClearAll={() => {
            console.log("Clear filters");
          }}
          filters={filters}
        >
          <div className={tw`pl-4`}>
            <Button onClick={() => console.log("Sort stuff")}>Sort</Button>
          </div>
        </Filters>
      </Card.Section>
      <div className={tw`border-t max-h-[400px] overflow-auto`}>
        <Table data={data} />
      </div>
    </Card>
  );
}

export default App;
