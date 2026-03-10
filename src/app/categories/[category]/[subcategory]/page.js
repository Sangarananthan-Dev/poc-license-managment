import { SubcategoryPage } from "@/components/pages/subcategory-page";

export default async function Page({ params }) {
  const { category, subcategory } = await params;

  return <SubcategoryPage categoryId={category} subcategoryId={subcategory} />;
}
