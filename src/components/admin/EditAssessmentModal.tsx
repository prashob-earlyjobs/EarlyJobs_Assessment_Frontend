import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,

} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
export interface Assessment {
    id: string;
    _id?: string; // Optional for compatibility with existing data
    title: string;
    description: string;
    skillTags: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: number; // in minutes
    questions: string[]; // Assuming questions are objects, adjust type as needed
    attempts: number;
    averageScore: number;
    completionRate: number;
    createdDate: string;
    type: 'mcq' | 'coding' | 'video' | 'mixed';
    category: 'technical' | 'aptitude' | 'personality' | 'communication';
    timeLimit: number; // in minutes
    passingScore: number; // in percentage
    tags: string[];

}
interface EditAssessmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (assessment) => void;
    initialData: Assessment | null;
}

const EditAssessmentModal: React.FC<EditAssessmentModalProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
}) => {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        type: 'mcq',
        category: 'technical',
        timeLimit: 30,
        questions: [],
        passingScore: 60,
        attempts: 0,
        averageScore: 0,
        completionRate: 0,
        tags: [],
        difficulty: 'Intermediate',
    });
    const [tagsInput, setTagsInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id,
                title: initialData.title,
                description: initialData.description || '',
                type: initialData.type,
                category: initialData.category,
                timeLimit: initialData.timeLimit,
                questions: initialData.questions || [],
                passingScore: initialData.passingScore || 60,
                tags: initialData.tags || [],
                difficulty: initialData.difficulty,
                attempts: initialData.attempts || 0,
                averageScore: initialData.averageScore || 0,
                completionRate: initialData.completionRate || 0,
            });
            setTagsInput(initialData.tags?.join(', ') || '');
        }
    }, [initialData, open]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value);
        const tags = e.target.value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        setFormData(prev => ({ ...prev, tags }));
    };

    const handleSubmit = () => {
        if (!formData.title || formData.title.length < 5) {
            toast.error('Title is required and must be at least 5 characters long');
            return;
        }
        if (formData.description && formData.description.length > 500) {
            toast.error('Description cannot exceed 500 characters');
            return;
        }
        if (!formData.timeLimit || formData.timeLimit < 1) {
            toast.error('Time limit must be at least 1 minute');
            return;
        }
        if (formData.passingScore && (formData.passingScore < 0 || formData.passingScore > 100)) {
            toast.error('Passing score must be between 0 and 100');
            return;
        }

        onSave(formData as Assessment);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit Assessment</DialogTitle>
                    <DialogDescription>
                        Edit the assessment details below.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Assessment Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., JavaScript Fundamentals"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe what this assessment covers..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={value => handleSelectChange('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mcq">MCQ</SelectItem>
                                    <SelectItem value="coding">Coding</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="mixed">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={value => handleSelectChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="technical">Technical</SelectItem>
                                    <SelectItem value="aptitude">Aptitude</SelectItem>
                                    <SelectItem value="personality">Personality</SelectItem>
                                    <SelectItem value="communication">Communication</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty</Label>
                            <Select
                                value={formData.difficulty}
                                onValueChange={value => handleSelectChange('difficulty', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timeLimit">Duration (minutes)</Label>
                            <Input
                                id="timeLimit"
                                name="timeLimit"
                                type="number"
                                value={formData.timeLimit}
                                onChange={handleInputChange}
                                placeholder="60"
                                min={1}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="questions">Number of Questions</Label>
                        <Input
                            id="questions"
                            name="questions"
                            type="number"
                            value={formData.questions.length}
                            readOnly
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Skill Tags</Label>
                        <Input
                            id="tags"
                            value={tagsInput}
                            onChange={handleTagsChange}
                            placeholder="e.g., JavaScript, React"
                        />
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="bg-secondary text-xs px-2 py-1 rounded mr-1 mb-1"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default EditAssessmentModal;