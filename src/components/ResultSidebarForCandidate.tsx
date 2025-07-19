import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

ChartJS.register(ArcElement, Tooltip, Legend);

const sidebarVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
};

const ResultSidebarForCandidate = ({ userAssessments, selectedCandidate, onClose }) => {
    const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
    const [assessment, setAssessment] = useState(null);

    useEffect(() => {
        if (userAssessments.length > 0 && !selectedAssessmentId) {
            setSelectedAssessmentId(userAssessments[0].id);
        }
    }, [userAssessments]);

    useEffect(() => {
        const selectedAssessment = userAssessments.find(assessment => assessment.id === selectedAssessmentId);
        if (selectedAssessment && selectedAssessment.result?.success && selectedAssessment.result.data) {
            setAssessment(selectedAssessment.result.data);
        } else {
            setAssessment(null);
            if (selectedAssessmentId) {
                toast.error('Invalid result data for the selected assessment');
            }
        }
    }, [selectedAssessmentId, userAssessments]);

    const handleAssessmentChange = (value) => {
        setSelectedAssessmentId(value);
    };

    const getScoreColor = (score) => {
        if (score >= 7) return 'bg-green-100 text-green-800';
        if (score >= 4) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getPieData = (skills) => {
        if (!skills || skills.length === 0) return { labels: [], datasets: [] };
        return {
            labels: skills.map(skill => skill.skill),
            datasets: [{
                data: skills.map(skill => skill.score || 0),
                backgroundColor: ['#4CAF50', '#FF6384', '#36A2EB'],
                borderColor: '#fff',
                borderWidth: 1,
            }],
        };
    };

   const pieOptions = {
        responsive: true,
        plugins: {
            legend: { position: "bottom" as const, labels: { boxWidth: 8, font: { size: 12 } } },
            tooltip: { enabled: true },
        },
        maintainAspectRatio: false,
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const selectedAssessment = userAssessments.find(assessment => assessment.id === selectedAssessmentId) || {};

    return (
        <AnimatePresence mode="wait">
            <>
                <motion.div
                    style={{ marginTop: '0px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black z-40"
                    onClick={onClose}
                />
                <motion.div
                    variants={sidebarVariants}
                    style={{ marginTop: '0px' }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 h-full w-[50%] bg-white border-l border-gray-200 z-50 shadow-lg overflow-y-auto"
                >
                    {userAssessments.length > 0 ? (
                        <Card className="h-full flex flex-col">
                            <div className="flex flex-col items-start justify-between p-4 border-b">
                            <CardHeader className="flex flex-row items-center justify-between p-4 w-full">
                                <div className="flex items-center gap-4">
                                    <CardTitle className="text-lg font-semibold">Assessment Results</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </CardHeader>
                                   <select
                                    value={selectedAssessmentId}
                                    onChange={(e) => setSelectedAssessmentId(e.target.value)}
                                    className="w-[200px] px-3 py-2 border rounded text-sm text-gray-700"
                                    >
                                    <option value="">Select an assessment</option>
                                    {userAssessments.map((assessment) => (
                                        <option key={assessment.id} value={assessment.id}>
                                        {assessment.title}
                                        </option>
                                    ))}
                                    </select>


                                    </div>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                                {assessment ? (
                                    <Tabs defaultValue="overview" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4">
                                            <TabsTrigger value="overview">Overview</TabsTrigger>
                                            <TabsTrigger value="skills">Skills</TabsTrigger>
                                            <TabsTrigger value="proctoring">Proctoring</TabsTrigger>
                                            <TabsTrigger value="recording">Recording</TabsTrigger>
                                        </TabsList>

                                        {/* Overview Tab */}
                                        <TabsContent value="overview">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-20 h-20 bg-gray-200">
                                                        <AvatarFallback className="text-xl">
                                                            {selectedCandidate?.firstName?.slice(0, 2).toUpperCase() || 'C'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="text-xl font-semibold">Interview of {selectedCandidate?.firstName}</h3>
                                                        <Badge className={getScoreColor(assessment.score)}>
                                                            Score: {assessment.report.score}/10
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Communication Score: {assessment.report.communicationScore}/10</p>
                                                    <p className="text-sm"><span className="font-medium">Overall Summary:</span> {assessment.report.overallSummary.conclusion}</p>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* Skills Tab */}
                                        <TabsContent value="skills">
                                            <div className="space-y-4">
                                                <div className="h-64">
                                                    <Pie
                                                        data={getPieData(assessment.report.reportSkills)}
                                                        options={pieOptions}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    {assessment.report.reportSkills.map((skill, index) => (
                                                        <div key={index} className="flex justify-between items-center">
                                                            <span className="text-sm font-medium">{skill.skill}</span>
                                                            <Badge className={getScoreColor(skill.score)}>{skill.score}/10</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Separator />
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium">Interview Summary</h4>
                                                    <ul className="list-disc list-inside text-sm">
                                                        {[...assessment.report.overallSummary.interviewSummary]
                                                            .sort((a, b) => {
                                                                const isGreenA = a.includes('<span style="color: green;">');
                                                                const isGreenB = b.includes('<span style="color: green;">');
                                                                return isGreenA === isGreenB ? 0 : isGreenA ? -1 : 1;
                                                            })
                                                            .map((summary, idx) => (
                                                                <li key={idx} dangerouslySetInnerHTML={{ __html: summary }} />
                                                            ))}
                                                    </ul>
                                                    <h4 className="text-sm font-medium">Communication Summary</h4>
                                                    <ul className="list-disc list-inside text-sm">
                                                        {[...(assessment?.report?.overallSummary?.communicationSummary || [])]
                                                            .sort((a, b) => {
                                                                const isGreenA = a.includes('<span style="color: green;">');
                                                                const isGreenB = b.includes('<span style="color: green;">');
                                                                return isGreenA === isGreenB ? 0 : isGreenA ? -1 : 1;
                                                            })
                                                            .map((summary, idx) => (
                                                                <li key={idx} dangerouslySetInnerHTML={{ __html: summary }} />
                                                            ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* Proctoring Tab */}
                                        <TabsContent value="proctoring">
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap justify-between gap-4">
                                                    <div className="flex items-center gap-3 bg-blue-100 rounded-xl p-4 shadow-sm w-full sm:w-[250px]">
                                                        <span className="text-yellow-500 text-xl">📊</span>
                                                        <div>
                                                            <p className="text-sm text-gray-700">Proctoring Score</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {assessment?.proctoringEventsData?.proctoringEvents?.proctoringScore}/10
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-green-100 rounded-xl p-4 shadow-sm w-full sm:w-[250px]">
                                                        <span className="text-yellow-500 text-xl">🖥️</span>
                                                        <div>
                                                            <p className="text-sm text-gray-700">Blur Events</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {assessment?.proctoringEventsData?.proctoringEvents?.blurEventCount}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-yellow-100 rounded-xl p-4 shadow-sm w-full sm:w-[250px]">
                                                        <span className="text-yellow-500 text-xl">📷</span>
                                                        <div>
                                                            <p className="text-sm text-gray-700">Camera Disabled</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {assessment?.proctoringEventsData?.proctoringEvents?.disableCameraEventCount}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-red-100 rounded-xl p-4 shadow-sm w-full sm:w-[250px]">
                                                        <span className="text-yellow-500 text-xl">🔇</span>
                                                        <div>
                                                            <p className="text-sm text-gray-700">Mute Events</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {assessment?.proctoringEventsData?.proctoringEvents?.muteEventCount}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="text-sm">
                                                    <span className="font-medium">Proctoring Logs:</span>
                                                    <Card className="mt-2 overflow-x-auto">
                                                        <CardContent className="p-0">
                                                            <table className="w-full text-sm border-collapse">
                                                                <thead>
                                                                    <tr className="bg-gray-100">
                                                                        <th className="border p-2 text-left">Event Type</th>
                                                                        <th className="border p-2 text-left">Clock Time (IST)</th>
                                                                        <th className="border p-2 text-left">Interview Time (s)</th>
                                                                        <th className="border p-2 text-left">Timestamp (s)</th>
                                                                        <th className="border p-2 text-left">IP Address</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {assessment?.proctoringEventsData?.proctoringEvents.proctoringLogs.map((log, idx) => {
                                                                        const clockTimeIST = new Date(log.event.eventTime.clockTime);
                                                                        clockTimeIST.setMinutes(clockTimeIST.getMinutes() + 330); // Convert UTC to IST (UTC+5:30)
                                                                        return (
                                                                            <tr key={idx} className="hover:bg-gray-50">
                                                                                <td className="border p-2">{log.event.eventType}</td>
                                                                                <td className="border p-2">
                                                                                    {clockTimeIST.toLocaleString('en-IN', {
                                                                                        year: 'numeric',
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                        second: '2-digit',
                                                                                        timeZoneName: 'short',
                                                                                    })}
                                                                                </td>
                                                                                <td className="border p-2">{log.event.eventTime.interviewTime || 'N/A'}</td>
                                                                                <td className="border p-2">{log.eventTimestamp.toFixed(3)}</td>
                                                                                <td className="border p-2">{log.event.metadata?.ipAddress || 'N/A'}</td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* Recording Tab */}
                                        <TabsContent value="recording">
                                            <div className="space-y-4">
                                                {selectedAssessment.recording ? (
                                                    <video src={selectedAssessment.recording} controls={true} />
                                                ) : (
                                                    <p>Recording not found</p>
                                                )}
                                                {selectedAssessment.transcript?.length > 0 ? (
                                                    <div className="space-y-4">
                                                        <h2 className="text-xl font-semibold mb-4">Transcript</h2>
                                                        {selectedAssessment.transcript.map((line, index) => {
                                                            const startTime = formatTime(line.start);
                                                            const endTime = formatTime(line.end);
                                                            const duration = line.end - line.start;
                                                            const timetaken = formatTime(duration);
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    style={{ width: "100%" }}
                                                                    className={`p-4 rounded-xl shadow-md ${
                                                                        line.speaker === 0
                                                                            ? "bg-blue-100 self-start text-left"
                                                                            : "bg-green-100 self-start text-left"
                                                                    }`}
                                                                >
                                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                        <p className="text-sm text-gray-600">
                                                                            <strong>
                                                                                {line.speaker === 0
                                                                                    ? `AI bot (${startTime} - ${endTime})`
                                                                                    : `${selectedCandidate?.firstName} (${startTime} - ${endTime})`}
                                                                                :
                                                                            </strong>
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            {timetaken}
                                                                        </p>
                                                                    </div>
                                                                    <p className="whitespace-pre-wrap text-gray-800">{line.text}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p>Transcript not found</p>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                ) : (
                                    <p className="text-center text-gray-500">No valid assessment data available</p>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <p className="text-center text-gray-500 p-4">No assessments available</p>
                    )}
                </motion.div>
            </>
        </AnimatePresence>
    );
};

export default ResultSidebarForCandidate;