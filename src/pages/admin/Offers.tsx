import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Plus, RefreshCw, Pencil } from "lucide-react";
import { getOffers, addOffer, editOffer } from "@/components/services/servicesapis";

const initialOffer = {
  code: "",
  discountType: "percentage",
  discountValue: 0,
  maxUsage: 1,
  expiresAt: "",
  isActive: true,
  minOrderValue: 0,
};

const Offers: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialOffer);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch offers from backend
  const fetchOffers = async () => {
    setLoading(true);
    const data = await getOffers();
    setOffers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEditOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await editOffer(editId, form);
      } else {
        await addOffer(form);
      }
      setOpen(false);
      setForm(initialOffer);
      setEditId(null);
      fetchOffers();
    } catch (e) {
      // Error handled in service
    }
  };

  const handleEditClick = (offer: any) => {
    setForm({
      code: offer.code,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      maxUsage: offer.maxUsage,
      expiresAt: offer.expiresAt ? offer.expiresAt.slice(0, 10) : "",
      isActive: offer.isActive,
      minOrderValue: offer.minOrderValue,
    });
    setEditId(offer._id);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setForm(initialOffer);
    setEditId(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-6">
          <div className="flex gap-4">
            <Button
              onClick={fetchOffers}
              variant="outline"
              size="sm"
              className="flex items-center border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => {
                setForm(initialOffer);
                setEditId(null);
                setOpen(true);
              }}
              className="flex items-center bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Max Usage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Used
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Expires
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Active
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Min Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-orange-500 mr-2" />
                        Loading offers...
                      </div>
                    </td>
                  </tr>
                ) : offers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      No offers found.
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => (
                    <tr
                      key={offer._id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-700">
                        {offer.code}
                      </td>
                      <td className="px-6 py-4 text-gray-700 capitalize">
                        {offer.discountType}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {offer.discountType === "percentage"
                          ? `${offer.discountValue}%`
                          : `₹${offer.discountValue}`}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {offer.maxUsage}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {offer.usedCount}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(offer.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            offer.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {offer.isActive ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {offer.minOrderValue ? `₹${offer.minOrderValue}` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditClick(offer)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 text-orange-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Offer Dialog */}
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              {editId ? "Edit Offer" : "Add New Offer"}
            </DialogTitle>
            <form
              className="space-y-6 mt-4"
              onSubmit={handleAddOrEditOffer}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Code
                </label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="OFFER2024"
                  disabled={!!editId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value
                </label>
                <input
                  name="discountValue"
                  type="number"
                  value={form.discountValue}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="10 or 100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Usage
                </label>
                <input
                  name="maxUsage"
                  type="number"
                  value={form.maxUsage}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires At
                </label>
                <input
                  name="expiresAt"
                  type="date"
                  value={form.expiresAt}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Order Value
                </label>
                <input
                  name="minOrderValue"
                  type="number"
                  value={form.minOrderValue}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="0"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                {editId ? "Update Offer" : "Add Offer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Offers;