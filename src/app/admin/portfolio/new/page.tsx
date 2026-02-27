import PortfolioForm from "../PortfolioForm";

export default function NewPortfolioItemPage() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold font-heading mb-8">
        New Portfolio Item
      </h1>
      <PortfolioForm />
    </div>
  );
}
