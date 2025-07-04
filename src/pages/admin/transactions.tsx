import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CreditCard } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getTransactionsForAdmin } from "@/components/services/servicesapis";

const LIMIT = 10;

const TransactionsForAdmin = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await getTransactionsForAdmin(page, LIMIT);
            if (response.success) {
                setTransactions(response.data.transactions);
                setTotal(response.data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < Math.ceil(total / LIMIT)) setPage(page + 1);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <main className="max-w-7xl mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">All Transactions</h2>
                        <p className="text-lg text-gray-600">
                            View and manage all transaction records.
                        </p>
                    </div>
                    <Card className="rounded-3xl border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl">Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-6 text-gray-600">Loading transactions...</div>
                            ) : transactions.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-700">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-2xl">Date</th>
                                                    <th className="px-4 py-3">Transaction ID</th>
                                                    <th className="px-4 py-3">Candidate Name</th>
                                                    <th className="px-4 py-3">Assessment Title</th>
                                                    <th className="px-4 py-3">Amount</th>
                                                    <th className="px-4 py-3">Franchise Name</th>
                                                    <th className="px-4 py-3 rounded-tr-2xl">Franchise Commission</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((transaction) => (
                                                    <tr key={transaction._id} className="border-b hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center space-x-1">
                                                                <Clock className="h-4 w-4 text-gray-500" />
                                                                <span>{formatDate(transaction.createdAt)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">{transaction.transactionId || "N/A"}</td>
                                                        <td className="px-4 py-3">{transaction.candidateName || "Unknown"}</td>
                                                        <td className="px-4 py-3">{transaction.assessmentTitle || "Unknown"}</td>
                                                        <td className="px-4 py-3">₹{transaction.transactionAmount}</td>
                                                        <td className="px-4 py-3">{transaction.franchiseName || "Unknown"}</td>
                                                        <td className="px-4 py-3">₹{transaction.franchiseCommission}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-between items-center mt-6">
                                        <Button
                                            onClick={handlePrevPage}
                                            disabled={page === 1}
                                            className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm text-gray-600">
                                            Page {page} of {Math.ceil(total / LIMIT) || 1}
                                        </span>
                                        <Button
                                            onClick={handleNextPage}
                                            disabled={page >= Math.ceil(total / LIMIT)}
                                            className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CreditCard className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
                                    <p className="text-gray-600 mb-6">
                                        There are no transactions to display at the moment.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </AdminLayout>
    );
};

export default TransactionsForAdmin;