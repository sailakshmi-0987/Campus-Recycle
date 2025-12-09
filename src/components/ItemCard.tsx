import React from 'react';
import { MapPin, Clock, Tag } from 'lucide-react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

const categoryColors = {
  books: 'bg-blue-100 text-blue-700',
  gadgets: 'bg-orange-100 text-orange-700',
  clothes: 'bg-pink-100 text-pink-700',
  furniture: 'bg-amber-100 text-amber-700',
  stationery: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-700',
};

const conditionLabels = {
  'new': 'Brand New',
  'like-new': 'Like New',
  'good': 'Good',
  'fair': 'Fair',
};

export function ItemCard({ item, onClick }: ItemCardProps) {
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[item.category]}`}>
            {item.category}
          </span>
        </div>
        {item.status !== 'available' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg font-semibold text-gray-900">
              {item.status === 'requested' ? 'Requested' : 'Given Away'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span className="line-clamp-1">{item.pickupLocation}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Tag size={14} />
            <span>{conditionLabels[item.condition]}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock size={14} />
            <span>{timeAgo(item.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
