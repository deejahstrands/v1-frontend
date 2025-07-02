"use client";

import { SectionContainer } from "@/components/common/section-container";
import { Button } from "@/components/common/button";


export function ConsultationCtaSection() {
    return (
        <section className="bg-secondary py-12 md:py-20 w-full">
            <SectionContainer>
                <div className="flex flex-col items-center justify-center text-center gap-4">
                    <h2 className="text-2xl md:text-3xl font-ethereal font-semibold text-gray-900 mb-2">
                        Need Help Picking&nbsp; the Perfect Unit?
                    </h2>
                    <p className="text-gray-700 mb-4 max-w-xl">
                        Speak with a certified Deejah stylist for expert advice tailored to you.
                    </p>
                    <Button
                        variant="primary"
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-calendar-days"
                            >
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <path d="M3 10h18" />
                                <path d="M8 14h.01" />
                                <path d="M12 14h.01" />
                                <path d="M16 14h.01" />
                                <path d="M8 18h.01" />
                                <path d="M12 18h.01" />
                                <path d="M16 18h.01" />
                            </svg>
                        }
                        className="mt-2 text-white"
                    >
                        <a href="/consultation">Book a Consultation</a>
                    </Button>
                </div>
            </SectionContainer>
        </section>
    );
} 