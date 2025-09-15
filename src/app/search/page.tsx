import SearchPageComp from "@/page_components/SearchPageComp";
import WithSuspense from "@/page_components/WithSuspense";

export default function SearchPage() {
  return (
    <WithSuspense>
      <SearchPageComp />
    </WithSuspense>
  );
}
