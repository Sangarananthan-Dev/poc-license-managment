import { SoftwarePage } from "@/components/pages/software-page";

export default async function Page({ params }) {
  const { category, software, subcategory } = await params;

  return (
    <SoftwarePage
      categoryId={category}
      softwareSlug={software}
      subcategoryId={subcategory}
    />
  );
}
