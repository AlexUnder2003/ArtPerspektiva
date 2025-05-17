import DefaultLayout from "@/layouts/default";
import CategoriesTabs from "@/components/tabs";
import { MasonryGrid } from "@/components/mansorygrid";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <CategoriesTabs></CategoriesTabs>
      <MasonryGrid cards={20} />
      
    </DefaultLayout>
  );
}
