import { motion, HTMLMotionProps } from "framer-motion";
import React, { memo } from "react";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  animation?: "fade" | "slideUp" | "slideDown" | "scale" | "glitch";
  delay?: number;
  duration?: number;
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  glitch: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  },
};

const scrollAnimations = {
  fade: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
  },
  slideDown: {
    initial: { opacity: 0, y: -30 },
    whileInView: { opacity: 1, y: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
  },
  glitch: {
    initial: { opacity: 0, skewX: 10 },
    whileInView: { opacity: 1, skewX: 0 },
  },
};

export const MotionWrapper = memo(({
  children,
  animation = "fade",
  delay = 0,
  duration = 0.4,
  ...props
}: MotionWrapperProps) => {
  return (
    <motion.div
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      exit={animations[animation].exit}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

MotionWrapper.displayName = 'MotionWrapper';

export const ScrollReveal = memo(({
  children,
  animation = "slideUp",
  delay = 0,
  duration = 0.5,
  ...props
}: MotionWrapperProps) => {
  return (
    <motion.div
      initial={scrollAnimations[animation].initial}
      whileInView={scrollAnimations[animation].whileInView}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';

export const PageTransition = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="animate-fade-in-up">
      {children}
    </div>
  );
});

PageTransition.displayName = 'PageTransition';
