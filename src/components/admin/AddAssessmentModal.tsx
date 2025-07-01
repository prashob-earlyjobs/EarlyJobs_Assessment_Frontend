
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Assessment } from '@/types/admin';

interface AddAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (assessment: Assessment) => void;
}

export const AddAssessmentModal: React.FC<AddAssessmentModalProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState('');
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [type, setType] = useState('');


  const handleAddTag = () => {
    if (currentTag.trim() && !skillTags.includes(currentTag.trim())) {
      setSkillTags([...skillTags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSkillTags(skillTags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    const newAssessment = {
      id: Date.now().toString(),
      title,
      description,
      tags: skillTags,
      difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      timeLimit: parseInt(duration),
      type: type,
      category: category,
      // questions: parseInt(questions),
      questions: [],
      attempts: 0,
      averageScore: 0,
      completionRate: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };

    onSave(newAssessment);

    // Reset form
    setTitle('');
    setDescription('');
    setDifficulty('');
    setType('');
    setDuration('');
    setCategory('');
    setQuestions('');
    setSkillTags([]);
    setCurrentTag('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Assessment</DialogTitle>
          <DialogDescription>
            Create a new assessment for candidates to take.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assessment Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., JavaScript Fundamentals"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this assessment covers..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
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
              <Select value={category} onValueChange={setCategory}>
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
              <Select value={difficulty} onValueChange={setDifficulty}>
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
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questions">Number of Questions</Label>
            <Input
              id="questions"
              type="number"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-tag">Skill Tags</Label>
            <div className="flex gap-2">
              <Input
                id="skill-tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="e.g., JavaScript"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {skillTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skillTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title || !description || !difficulty}>
            Create Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
