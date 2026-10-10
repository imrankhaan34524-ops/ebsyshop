'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import MembershipBanner from "@/components/MembershipBanner";
import FAQ from "@/components/FAQ";
import HotDeals from "@/components/HotDeals";
import FeaturedStores from "@/components/FeaturedStores";

export default function Home() {
    return (
        <div>
            <Hero />
            <HotDeals />
            <LatestProducts />
            <FeaturedStores />
            <BestSelling />
             <MembershipBanner />
            <OurSpecs />
            <FAQ />
            <Newsletter />
        </div>
    );
}