
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

interface AddFranchiseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (franchise: any) => void;
}

export const AddFranchiseModal: React.FC<AddFranchiseModalProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState('');

  const handleSave = () => {
    const newFranchise = {
      id: Date.now().toString(),
      name,
      contactEmail,
      contactPhone,
      location,
      activeUsers: 0,
      totalAssessments: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active' as const,
    };
    
    onSave(newFranchise);
    
    // Reset form
    setName('');
    setContactEmail('');
    setContactPhone('');
    setLocation('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Franchise</DialogTitle>
          <DialogDescription>
            Register a new franchise partner to the platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Franchise Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., TechCorp Solutions"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="admin@techcorp.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Contact Phone</Label>
            <Input
              id="phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1-555-0123"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="New York, NY"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name || !contactEmail}>
            Add Franchise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
