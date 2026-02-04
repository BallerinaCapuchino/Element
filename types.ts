import React from 'react';

// Extend window object for Telegram
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        initDataUnsafe?: any;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
      };
    };
  }
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface VisitorLog {
  id: string;
  ip: string;
  userAgent: string;
  timestamp: string;
}

export interface WoodOption {
  id: string;
  name: string;
  color: string;
  description: string;
  textureOpacity: number;
  isCustom?: boolean;
}

export type InteriorType = 'velvet' | 'leather' | 'ecoleather' | 'alcantara' | 'none' | 'custom';

export interface InteriorOption {
  id: string;
  name: string;
  type: InteriorType;
  typeName: string; // Название типа на русском (Бархат, Кожа и т.д.)
  color: string;
}

// Order Configuration State Interface
export interface OrderConfiguration {
  customWood: string;
  leatherAnimal: string;
  customColor: string;
  customInteriorText: string;
  lodgement: boolean;
  varnish: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: string; 
  details: {
    wood?: string;
    customWood?: string;
    interior?: string; 
    customInterior?: string;
    leatherAnimal?: string;
    customColor?: string;
    lodgement?: boolean;
    varnish?: boolean;
    comment?: string;
    contactMethod?: string;
    contactEmail?: string;
    finish?: string;
  };
}