import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CreditCard } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getTransactionsForSprAdmin, getTransactionsForFranchisenAdmin } from "@/components/services/servicesapis";
import { useAdmin } from "@/context/AdminContext";

const LIMIT = 10;

const TransactionsForAdmin = () => {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const { currentUser, setCurrentUser } = useAdmin();
    const [totalCommission, setTotalCommission] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const fetchTransactions = async () => {
        setLoading(true);
        if (currentUser.role === 'super_admin') {
            try {
                const response = await getTransactionsForSprAdmin(page, LIMIT);
                if (response.success) {
                    setTransactions(response.data.transactions);
                    setTotal(response.data.pagination.total);
                    setTotalAmount(response.data.earnings.totalAmount);
                    // Note: Super admin API currently lacks totalCommission; consider adding it if needed
                    setTotalCommission(response.data.earnings.totalCommission || 0);

                }
            } catch (error) {
                console.error("Failed to fetch transactions:");
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const response = await getTransactionsForFranchisenAdmin(page, LIMIT);
                if (response.success) {
                    setTransactions(response.data.transactions);
                    setTotal(response.data.pagination.total);
                    setTotalCommission(response.data.earnings.totalCommission || 0);
                }
            } catch (error) {
                console.error("Failed to fetch transactions:");
            } finally {
                setLoading(false);
            }
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
                <main className="max-w-7xl mx-auto px-6 py-4">
                    {/* <div className="mb-4">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">All Transactions</h2>
                        <p className="text-lg text-gray-600">
                            View and manage all transaction records.
                        </p>
                    </div> */}
                    <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg mb-4 border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Earnings Summary</h3>

                        <div className="grid sm:grid-cols-3 gap-4 text-sm sm:text-base">
                            {currentUser.role === 'super_admin' && (
                                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
                                    <p className="text-gray-600">Total Earnings</p>
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 m-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="Rupee">
                                                <defs>
                                                    <linearGradient id="a" x1=".5" x2=".5" y2="1" gradientUnits="objectBoundingBox">
                                                        <stop offset="0" stop-color="#ddbf1e" className="stopColorffb508 svgShape"></stop>
                                                        <stop offset="1" stop-color="#fcd502" className="stopColorfc2a02 svgShape"></stop>
                                                    </linearGradient>
                                                </defs>
                                                <g transform="translate(-13674 -765)" fill="#000000" className="color000000 svgShape">
                                                    <circle cx="256" cy="256" r="256" fill="url(#a)" transform="translate(13674 765)"></circle>
                                                    <path fill="#ffffff" d="M14004.364 955.958a5.264 5.264 0 0 0-3.888-1.521h-28.921a58.544 58.544 0 0 0-10.826-24.355h39.406a5.2 5.2 0 0 0 5.409-4.982 5.09 5.09 0 0 0 0-.428v-17.255a5.2 5.2 0 0 0-4.979-5.412 5.138 5.138 0 0 0-.43 0h-140.718a5.208 5.208 0 0 0-5.412 5 4.81 4.81 0 0 0 0 .416v22.494a5.487 5.487 0 0 0 5.412 5.412h24.525q35.685 0 45.326 19.111h-69.851a5.208 5.208 0 0 0-5.412 5 4.81 4.81 0 0 0 0 .416v17.253a5.207 5.207 0 0 0 5 5.406c.137.006.273.005.41 0h72.222q-3.721 13.874-17.338 21.143t-35.941 7.277h-18.941a5.487 5.487 0 0 0-5.412 5.404v21.482a5.059 5.059 0 0 0 1.521 3.721q32.472 34.5 84.229 96.576a4.987 4.987 0 0 0 4.229 2.03h32.98a4.905 4.905 0 0 0 4.906-3.046 4.621 4.621 0 0 0-.677-5.751q-49.382-60.552-77.631-90.656 28.754-3.383 46.682-18.6t21.818-39.579h28.414a5.212 5.212 0 0 0 5.413-5 5.496 5.496 0 0 0 0-.406V959.85a5.27 5.27 0 0 0-1.525-3.892Z" className="colorffffff svgShape"></path>
                                                </g>
                                            </svg>
                                        </div>
                                        <p className="text-xl font-semibold text-gray-900">{totalAmount}</p>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                                <p className="text-gray-600">Total Commission</p>
                                <div className="flex items-center">
                                    <div className="w-5 h-5 m-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="Rupee">
                                            <defs>
                                                <linearGradient id="a" x1=".5" x2=".5" y2="1" gradientUnits="objectBoundingBox">
                                                    <stop offset="0" stop-color="#ddbf1e" className="stopColorffb508 svgShape"></stop>
                                                    <stop offset="1" stop-color="#fcd502" className="stopColorfc2a02 svgShape"></stop>
                                                </linearGradient>
                                            </defs>
                                            <g transform="translate(-13674 -765)" fill="#000000" className="color000000 svgShape">
                                                <circle cx="256" cy="256" r="256" fill="url(#a)" transform="translate(13674 765)"></circle>
                                                <path fill="#ffffff" d="M14004.364 955.958a5.264 5.264 0 0 0-3.888-1.521h-28.921a58.544 58.544 0 0 0-10.826-24.355h39.406a5.2 5.2 0 0 0 5.409-4.982 5.09 5.09 0 0 0 0-.428v-17.255a5.2 5.2 0 0 0-4.979-5.412 5.138 5.138 0 0 0-.43 0h-140.718a5.208 5.208 0 0 0-5.412 5 4.81 4.81 0 0 0 0 .416v22.494a5.487 5.487 0 0 0 5.412 5.412h24.525q35.685 0 45.326 19.111h-69.851a5.208 5.208 0 0 0-5.412 5 4.81 4.81 0 0 0 0 .416v17.253a5.207 5.207 0 0 0 5 5.406c.137.006.273.005.41 0h72.222q-3.721 13.874-17.338 21.143t-35.941 7.277h-18.941a5.487 5.487 0 0 0-5.412 5.404v21.482a5.059 5.059 0 0 0 1.521 3.721q32.472 34.5 84.229 96.576a4.987 4.987 0 0 0 4.229 2.03h32.98a4.905 4.905 0 0 0 4.906-3.046 4.621 4.621 0 0 0-.677-5.751q-49.382-60.552-77.631-90.656 28.754-3.383 46.682-18.6t21.818-39.579h28.414a5.212 5.212 0 0 0 5.413-5 5.496 5.496 0 0 0 0-.406V959.85a5.27 5.27 0 0 0-1.525-3.892Z" className="colorffffff svgShape"></path>
                                            </g>
                                        </svg>
                                    </div>
                                    <p className="text-xl font-semibold text-gray-900">{totalCommission}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-sm">
                                <p className="text-gray-600">Total Assessments</p>
                                <p className="text-xl font-semibold text-gray-900">{transactions.length}</p>
                            </div>
                        </div>
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
                                                    {
                                                        currentUser.role === 'super_admin' &&
                                                        <th className="px-4 py-3">Franchise Name</th>
                                                    }
                                                    <th className="px-4 py-3 rounded-tr-2xl">{currentUser.role !== 'super_admin' ? 'Your Commission' : 'Franchise Commission'}</th>
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
                                                        {
                                                            currentUser.role === 'super_admin' &&
                                                            <td className="px-4 py-3">{transaction.franchiseName || "Unknown"}</td>
                                                        }
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