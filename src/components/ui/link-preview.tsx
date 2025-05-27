import React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const LinkPreview = ({ href, children, className = '' }: LinkPreviewProps) => {
  const previewUrl = `https://api.microlink.io/?url=${encodeURIComponent(href)}&screenshot=true&meta=false&embed=screenshot.url`;

  return (
    <HoverCard.Root openDelay={100} closeDelay={200}>
      <HoverCard.Trigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors ${className}`}
        >
          {children}
          <ExternalLink className="h-4 w-4" />
        </a>
      </HoverCard.Trigger>
      
      <HoverCard.Portal>
        <HoverCard.Content side="top" align="center" sideOffset={10}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-lg shadow-xl p-1 w-[480px]"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <motion.img
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                src={previewUrl}
                alt="Website Preview"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            <div className="p-3">
              <p className="text-sm text-gray-600 truncate">{href}</p>
            </div>
          </motion.div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};