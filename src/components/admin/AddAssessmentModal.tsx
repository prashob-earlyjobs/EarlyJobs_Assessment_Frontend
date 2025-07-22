import React, { useEffect, useState } from 'react';
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
import { addAssessment, getAssessmentsVelox, getShortIdForUrl } from '../services/servicesapis';
import { toast } from 'sonner';

type AssessmentWithOptionalId = Omit<Assessment, 'assessmentId'> & { assessmentId?: string | null };

interface AddAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAssessmentModal: React.FC<AddAssessmentModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState<"technical" | "aptitude" | "personality" | "communication" | ''>('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState('');
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [type, setType] = useState<"mcq" | "coding" | "video" | "mixed" | ''>('');
  const [assessmentData, setAssessmentData] = useState([]);
  const [basePrice, setBasePrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [offerType, setOfferType] = useState<'percentage' | 'flat' | ''>('');
  const [offerValue, setOfferValue] = useState('');
  const [offerValidUntil, setOfferValidUntil] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [shortId, setShortId] = useState('');

  useEffect(() => {
    const getAssessmentsFromVelox = async () => {
      try {
        const response = await getAssessmentsVelox();
        if (response && Array.isArray(response)) {
          setAssessmentData(response);
        }
      } catch (error) {
        return
      }
    };
    const getShortId= async () => {
      
      try {
        const response = await getShortIdForUrl();
        if(!response.success){
          throw new Error(response.message)
        }
       setShortId(response.shortId)
      } catch (error) {
        toast.error(`${error?.response?.data?.message || "Failed to get assessment details"}.`);
        return
      }
    }
    if (open) {
      getAssessmentsFromVelox();
      getShortId()
    }
  }, [open]);

  const handleAddTag = () => {
    if (currentTag.trim() && !skillTags.includes(currentTag.trim())) {
      setSkillTags([...skillTags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSkillTags(skillTags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!basePrice || !discountedPrice || !offerTitle || !offerType || !offerValue || !offerValidUntil) {
      alert('All pricing and offer fields are required!');
      return;
    }
    if (parseFloat(discountedPrice) >= parseFloat(basePrice)) {
      alert('Discounted price must be less than base price!');
      return;
    }
    const validUntilDate = new Date(offerValidUntil);
    if (isNaN(validUntilDate.getTime()) || validUntilDate <= new Date()) {
      alert('Offer expiration date must be in the future!');
      return;
    }

    const selectedAssessment = assessmentData.find(assessment => assessment.title === title);
    const assessmentId = selectedAssessment ? selectedAssessment.assessmentId : null;

    const newAssessment: Assessment = {
      id: Date.now().toString(),
      assessmentId, // Include the matching assessmentId from API
      title,
      description,
      tags: skillTags,
      skillTags: skillTags,
      difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      timeLimit: parseInt(duration),
      duration: parseInt(duration),
      type: type as "mcq" | "coding" | "video" | "mixed",
      category: category as "technical" | "aptitude" | "personality" | "communication",
      // questions: [],
      attempts: 0,
      averageScore: 0,
      completionRate: 0,
      createdDate: new Date().toISOString().split('T')[0],
      passingScore: 0,
      shortId,
      pricing: {
        basePrice: parseFloat(basePrice),
        discountedPrice: parseFloat(discountedPrice),
      },
      offer: {
        title: offerTitle,
        type: offerType,
        value: parseFloat(offerValue),
        validUntil: validUntilDate.toISOString(),
      },
      isPremium,
    };


    try {
      const response = await addAssessment(newAssessment);
      if (!response.success) {
        throw new Error(response.message);
      }
      setTitle('');
      setDescription('');
      setDifficulty('');
      setType('');
      setDuration('');
      setCategory('');
      setQuestions('');
      setSkillTags([]);
      setCurrentTag('');
      setBasePrice('');
      setDiscountedPrice('');
      setOfferTitle('');
      setOfferType('');
      setOfferValue('');
      setOfferValidUntil('');
      setIsPremium(false);
      onOpenChange(false);
      setShortId('');
      toast.success('Assessment added successfully!');


    }
    catch (error) {
      return
    }


    // Reset form after saving

  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Assessment</DialogTitle>
          <DialogDescription>
            Create a new assessment for candidates to take.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assessment Title *</Label>
            <Select value={title} onValueChange={setTitle}>
              <SelectTrigger>
                <SelectValue placeholder="Select a title" />
              </SelectTrigger>
              <SelectContent>
                {assessmentData.map((assessment, index) => (
                  <SelectItem key={index} value={assessment.title}>
                    {assessment.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
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
              <Label htmlFor="type">Type *</Label>
              <Select value={type} onValueChange={(v) => setType(v as "mcq" | "coding" | "video" | "mixed" | "")}>
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
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as "technical" | "aptitude" | "personality" | "communication" | "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="non-technical">Non Technical</SelectItem>
                  
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
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
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
              />
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="questions">Number of Questions *</Label>
            <Input
              id="questions"
              type="number"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="25"
            />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="skill-tag">Skill Tags *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (Rs) *</Label>
              <Input
                id="basePrice"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="100"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountedPrice">Discounted Price (Rs) *</Label>
              <Input
                id="discountedPrice"
                type="number"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                placeholder="80"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerTitle">Offer Title *</Label>
            <Input
              id="offerTitle"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              placeholder="Summer Discount"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offerType">Offer Type *</Label>
              <Select value={offerType} onValueChange={setOfferType as (value: string) => void}>
                <SelectTrigger>
                  <SelectValue placeholder="Select offer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="flat">Flat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="offerValue">Offer Value *</Label>
              <Input
                id="offerValue"
                type="number"
                value={offerValue}
                onChange={(e) => setOfferValue(e.target.value)}
                placeholder="10"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label htmlFor="offerValidUntil">Offer Valid Until *</Label>
            <Input
              id="offerValidUntil"
              type="date"
              value={offerValidUntil}
              onChange={(e) => setOfferValidUntil(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Current date as minimum
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortId">Assessment ID </Label>
            <Input
              id="shortId"
              value={shortId}
              readOnly
            />
          </div>
          </div>


          <div className="space-y-2 flex items-center justify-start">
            <Input
              id="isPremium"
              type="checkbox"
              checked={isPremium}
              className="w-4 h-4"
              onChange={(e) => setIsPremium(e.target.checked)}
            />
            <Label htmlFor="isPremium" style={{ marginLeft: '2px', marginTop: '0px' }}>Is Premium </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title || !description || !difficulty || !basePrice || !discountedPrice || !offerTitle || !offerType || !offerValue || !offerValidUntil}>
            Create Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};