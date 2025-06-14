import type React from "react"
import type { Biodata } from "@/types/biodata"

interface BiodataReviewSectionProps {
  biodata?: Biodata | null
}

const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-1 py-1.5 border-b border-gray-100 last:border-b-0">
    <dt className="font-medium text-sm text-gray-500">{label}</dt>
    <dd className="col-span-2 text-sm text-gray-800">{value || "N/A"}</dd>
  </div>
)

const BiodataReviewSection = () => <div>Biodata Review Section Placeholder</div>
export default BiodataReviewSection
