import HeroScrollVideo from '@/components/HeroScrollVideo';
import NamesSection from '@/components/NamesSection';
import GallerySection from '@/components/GallerySection';
import CountdownSection from '@/components/CountdownSection';
import SpotifySection from '@/components/SpotifySection';
import SiteFooter from '@/components/SiteFooter';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <>
      <HeroScrollVideo />
      <NamesSection />
      <GallerySection />
      <CountdownSection />
      <SpotifySection />
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
