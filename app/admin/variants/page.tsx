import { AdminShell } from "@/components/admin/admin-shell";
import { CrudManager } from "@/components/admin/crud-manager";

export default function AdminVariantsPage() {
  return (
    <AdminShell>
      <h1 className="mb-6 text-4xl text-[#21183d]">Variant Management</h1>
      <CrudManager
        table="product_variants"
        fields={[
          { name: "product_id", label: "Product ID" },
          { name: "size", label: "Size" },
          { name: "color", label: "Color" },
          { name: "stock_quantity", label: "Stock Quantity", type: "number" }
        ]}
      />
    </AdminShell>
  );
}
