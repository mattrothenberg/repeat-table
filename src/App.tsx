import {
  randUuid,
  randUrl,
  randFullName,
  randCity,
  randNumber,
} from "@ngneat/falso";
// @ts-ignore
import { Table } from "./components/table";

const data = Array.from({ length: 20 }).map((_, i) => {
  return {
    id: randUuid(),
    url: randUrl(),
    name: randFullName(),
    location: randCity(),
    orders: randNumber(),
    amountSpent: randNumber(),
  };
});

function App() {
  return <Table data={data} />;
}

export default App;
