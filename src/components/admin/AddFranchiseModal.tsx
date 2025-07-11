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
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { addFranchiser } from '../services/servicesapis';
import { set } from 'date-fns';

interface AddFranchiseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (franchise: {
    name: string;
    email: string;
    password: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    mobile: string;
  }) => void;
}

export const AddFranchiseModal: React.FC<AddFranchiseModalProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  const [franchiseId, setFranchiseId] = useState('');

  const handleSave = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!name || !email || !password || !confirmPassword || !street || !city || !state || !country || !zipCode) {
      toast.error("All fields are required!");
      return;
    }

    const newFranchise = {
      name,
      email,
      password, // Note: In a real app, hash this before saving
      street,
      city,
      state,
      country,
      zipCode,
      mobile,
      franchiseId,
    };
    try {
      
      const response = await addFranchiser(newFranchise);
      onSave(newFranchise);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setStreet('');
      setCity('');
      setState('');
      setCountry('');
      setZipCode('');
      setMobile('');
      setFranchiseId('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      onOpenChange(false);
    }

    catch (error) {
      toast.error(`${error?.response?.data?.message}.`);
      return error;
    }

    // Reset form
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[56vw] h-[72vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Franchise</DialogTitle>
          <DialogDescription>
            Register a new franchise partner to the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Franchise Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., TechCorp Solutions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@techcorp.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile *</Label>
            <Input
              id="mobile"
              type="number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="9876543210"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="franchiseId">Franchise ID *</Label>
            <Input
              id="franchiseId"
              value={franchiseId}
              onChange={(e) => setFranchiseId(e.target.value)}
              placeholder="EJF0000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street *</Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main St"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="NY"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code *</Label>
            <Input
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="10001"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name || !email || !password || !confirmPassword || !street || !city || !state || !country || !zipCode || !franchiseId}>
            Add Franchise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};