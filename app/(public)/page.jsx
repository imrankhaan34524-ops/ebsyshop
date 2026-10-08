'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import MembershipBanner from "@/components/MembershipBanner";
import FAQ from "@/components/FAQ";

export default function Home() {
    return (
        <div>
            <Hero />
            <LatestProducts />
            <BestSelling />
             <MembershipBanner />
            <OurSpecs />
            <FAQ />
            <Newsletter />
        </div>
    );
}