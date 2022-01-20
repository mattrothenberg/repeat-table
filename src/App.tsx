import { seed, randNumber, randProductName, randImg } from "@ngneat/falso";
import {
  Button,
  Card,
  ChoiceList,
  FilterInterface,
  Filters,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { tw } from "twind";
// @ts-ignore
import { Table } from "./components/table";

const data = Array.from({ length: 20 }).map((_, i) => {
  seed(`random-${i}`);
  return {
    id: randNumber({ length: 2 }),
    photo: randImg(),
    title: randProductName(),
    titleId: randNumber({ length: 2 }),
    variantId: randNumber({ length: 2 }),
    inventory: randNumber({ max: 100, min: -100 }),
    interval: randNumber({ max: 30, min: 1 }),
    status: "Active",
    channel: "Available",
  };
});

function App() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string[] | null>(null);
  const [visibility, setVisibility] = useState<string[] | null>(null);

  const handleStatusChange = useCallback((values: string[]) => {
    setStatus(values);
  }, []);

  const handleVisibilityChange = useCallback((values: string[]) => {
    setVisibility(values);
  }, []);

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
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ]}
          selected={status || []}
          onChange={handleStatusChange}
          allowMultiple={false}
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
            { label: "Shown", value: "shown" },
            { label: "Hidden", value: "hidden" },
          ]}
          selected={visibility || []}
          onChange={handleVisibilityChange}
          allowMultiple={false}
        />
      ),
    },
  ];

  const handleClearStatus = useCallback(() => {
    setStatus(null);
  }, []);

  const handleClearVisibility = useCallback(() => {
    setVisibility(null);
  }, []);

  const handleClearAll = useCallback(() => {
    setQuery("");
    handleClearStatus();
    handleClearVisibility();
  }, []);

  const appliedFilters = [];

  if (status && status.length > 0) {
    const key = "status";
    appliedFilters.push({
      key,
      label: `Status ${status.join(", ")}`,
      onRemove: handleClearStatus,
    });
  }
  if (visibility && visibility.length > 0) {
    const key = "visibility";
    appliedFilters.push({
      key,
      label: `Visibility: ${visibility.join(", ")}`,
      onRemove: handleClearVisibility,
    });
  }

  return (
    <Card>
      <Card.Section>
        <Filters
          appliedFilters={appliedFilters}
          queryPlaceholder="Search by Title ID, Variant ID"
          queryValue={query}
          onQueryChange={setQuery}
          onQueryClear={() => setQuery("")}
          onClearAll={handleClearAll}
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
