
import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">About Narrative.</h1>
        <p className="text-lg text-muted-foreground font-serif italic">
          "A digital sanctuary for thoughtful storytelling."
        </p>
      </header>

      <div className="space-y-8 text-lg font-serif leading-relaxed text-foreground/90">
        <p>
          Welcome to <span className="font-bold">Narrative</span>. This platform was born out of a desire to strip away the noise of the modern web and return to what matters most: the story.
        </p>
        <p>
          In an age of endless scrolling and algorithmic feeds, we believe in the power of slow content—articles that demand your attention, essays that provoke thought, and visuals that inspire. We cover a spectrum of topics from design and culture to technology and personal growth, always with a lens of curiosity and depth.
        </p>
        
        <hr className="my-12 border-border" />

        <h3 className="text-2xl font-bold mb-4 font-sans tracking-tight">The Editor</h3>
        <p>
          Curated by Lokesh Patil, Narrative is a reflection of a personal journey through the digital landscape. It serves as a portfolio of ideas, a collection of experiments, and a canvas for creative expression.
        </p>
        <p>
          Whether you're here to read, to learn, or simply to find a moment of calm, we hope you leave with something valuable.
        </p>
      </div>
    </div>
  );
}
