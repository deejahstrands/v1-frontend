"use client"

import { SectionContainer } from "@/components/common/section-container";
import { Button } from "@/components/common/button";
import Image from "next/image";
import { Settings2 } from "lucide-react";
import { motion } from "motion/react"

export function FeaturesSection() {
  return (
    <div className="bg-secondary w-full mt-8">
      <SectionContainer className="bg-secondary rounded-2xl py-8 md:py-16 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center h-full">
          {/* Left: Image */}
          <motion.div 
            className="col-span-1 lg:col-span-7 xl:col-span-8 h-full flex items-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src="/images/cos.jpg"
                alt="Customize your own unit"
                width={800}
                height={660}
                className="rounded-xl object-cover w-full h-full max-h-[400px] md:max-h-[660px]"
                priority
              />
            </motion.div>
          </motion.div>
          
          {/* Right: Content */}
          <motion.div 
            className="col-span-1 lg:col-span-5 xl:col-span-4 flex flex-col items-start justify-center h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.4
            }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-ethereal mb-4 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.6
              }}
            >
              Customize Your Own Unit
            </motion.h2>
            
            <motion.p 
              className="text-sm md:text-base text-gray-700 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.8
              }}
            >
              Tailored to Your specifications: A custom-made wig uniquely crafted to reflect your personality, style, and preferences.
            </motion.p>
            
            <motion.p 
              className="text-sm md:text-base text-gray-700 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 1.0
              }}
            >
              Personally creating a unit that is uniquely yours from the color, cut, and styling
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 1.2
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="primary" icon={<Settings2 size={18} />}>
                Start Customizing
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </SectionContainer>
    </div>
  );
} 