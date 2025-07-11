import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DollarSign, 
  Calendar, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MoreHorizontal,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Opportunity {
  id: string;
  name: string;
  value: {
    estimated: number;
    weighted: number;
    currency: string;
  };
  stage: string;
  probability: number;
  expectedClose: Date;
  contact: {
    name: string;
    email: string;
    company: string;
    avatar?: string;
  };
  assignedTo: {
    name: string;
    avatar?: string;
  };
  daysInStage: number;
  lastActivity?: Date;
  nextActivity?: {
    type: string;
    date: Date;
    description: string;
  };
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onScheduleActivity?: (id: string) => void;
  className?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onEdit,
  onDelete,
  onViewDetails,
  onScheduleActivity,
  className = ''
}) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStageColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      'prospecting': 'bg-gray-100 text-gray-800',
      'qualification': 'bg-blue-100 text-blue-800',
      'needs_analysis': 'bg-yellow-100 text-yellow-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed_won': 'bg-green-100 text-green-800',
      'closed_lost': 'bg-red-100 text-red-800'
    };
    return stageColors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    if (probability >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const isOverdue = opportunity.expectedClose < new Date();
  const daysUntilClose = Math.ceil((opportunity.expectedClose.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
              {opportunity.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStageColor(opportunity.stage)}>
                {opportunity.stage.replace('_', ' ').toUpperCase()}
              </Badge>
              <span className={`text-sm font-medium ${getPriorityColor(opportunity.probability)}`}>
                {opportunity.probability}%
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewDetails?.(opportunity.id)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(opportunity.id)}>
                Edit Opportunity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onScheduleActivity?.(opportunity.id)}>
                Schedule Activity
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(opportunity.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Value and Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(opportunity.value.estimated, opportunity.value.currency)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Weighted: {formatCurrency(opportunity.value.weighted, opportunity.value.currency)}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Probability</span>
              <span className={getPriorityColor(opportunity.probability)}>
                {opportunity.probability}%
              </span>
            </div>
            <Progress value={opportunity.probability} className="h-2" />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={opportunity.contact.avatar} />
              <AvatarFallback>
                {opportunity.contact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {opportunity.contact.name}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Building className="h-3 w-3" />
                <span className="truncate">{opportunity.contact.company}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
          </div>
        </div>

        {/* Timeline Information */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Expected Close</span>
            </div>
            <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {formatDate(opportunity.expectedClose)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">In Stage</span>
            </div>
            <span className="text-gray-900">
              {opportunity.daysInStage} day{opportunity.daysInStage !== 1 ? 's' : ''}
            </span>
          </div>

          {daysUntilClose <= 30 && (
            <div className="flex items-center gap-1 text-xs">
              <Target className="h-3 w-3 text-orange-500" />
              <span className={isOverdue ? 'text-red-600' : 'text-orange-600'}>
                {isOverdue 
                  ? `Overdue by ${Math.abs(daysUntilClose)} day${Math.abs(daysUntilClose) !== 1 ? 's' : ''}`
                  : `${daysUntilClose} day${daysUntilClose !== 1 ? 's' : ''} until close`
                }
              </span>
            </div>
          )}
        </div>

        {/* Next Activity */}
        {opportunity.nextActivity && (
          <div className="bg-blue-50 rounded-lg p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-800">
                Next Activity
              </span>
              <span className="text-xs text-blue-600">
                {formatDate(opportunity.nextActivity.date)}
              </span>
            </div>
            <p className="text-sm text-blue-700">
              {opportunity.nextActivity.type}: {opportunity.nextActivity.description}
            </p>
          </div>
        )}

        {/* Assigned To */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={opportunity.assignedTo.avatar} />
              <AvatarFallback className="text-xs">
                {opportunity.assignedTo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">
              {opportunity.assignedTo.name}
            </span>
          </div>
          
          {opportunity.lastActivity && (
            <span className="text-xs text-gray-500">
              Last activity: {formatDate(opportunity.lastActivity)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};