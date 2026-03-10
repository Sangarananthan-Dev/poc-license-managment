import { CategoryPage } from "@/components/pages/category-page";

export default async function Page({ params }) {
  const { category } = await params;

  return <CategoryPage categoryId={category} />;
}
